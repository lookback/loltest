"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const assert_1 = require("assert");
const flatten_1 = require("./lib/flatten");
const serialize_error_1 = require("./lib/serialize-error");
const fs_1 = __importDefault(require("fs"));
// test() puts tests into here. This is *per file*.
exports.foundTests = [];
const sendMessage = async (msg) => {
    if (!process.send) {
        console.warn('Not in child process, cannot send message');
        return;
    }
    await new Promise((rs) => process.send(msg, rs));
};
// Child process test runner
exports.runChild = async (conf) => {
    // tslint:disable-next-line:no-let
    let uncaughtException = false;
    // tslint:disable-next-line:no-let
    let unhandledRejection = false;
    process.on('uncaughtException', (e) => {
        console.log('Uncaught exception:', e);
        uncaughtException = true;
    });
    process.on('unhandledRejection', (e) => {
        console.log('Unhandled promise rejection:', e);
        unhandledRejection = true;
    });
    const testFilePaths = [conf.target];
    registerShadowedTs(conf);
    // tslint:disable-next-line: no-object-mutation
    process.env.NODE_ENV = process.env.NODE_ENV || 'test';
    const testFiles = testFilePaths.map((testPath) => {
        require(testPath);
        return {
            filePath: testPath,
            // "foundTests" is now filled with TestRuns. Remove them from the array
            // for next test file.
            tests: exports.foundTests.splice(0, exports.foundTests.length),
        };
    });
    const numFiles = testFiles.length;
    const totalNumTests = testFiles.reduce((acc, testFile) => acc + testFile.tests.length, 0);
    // deliberately don't await this.
    sendMessage({
        kind: 'run_start',
        payload: {
            numFiles,
            total: totalNumTests,
        },
    });
    const startTime = Date.now();
    const allTests = testFiles.map(doTest);
    const results = await Promise.all(allTests);
    const flat = flatten_1.flatten(results);
    const testsAsBooleans = flat.map((t) => !t.fail);
    const allGood = testsAsBooleans.every((p) => p);
    const clean = allGood && !uncaughtException && !unhandledRejection;
    const finishedMsg = {
        kind: 'run_complete',
        payload: {
            total: testsAsBooleans.length,
            passed: testsAsBooleans.filter((p) => p).length,
            failed: testsAsBooleans.filter((p) => !p).length,
            duration: Date.now() - startTime,
            numFiles,
        },
    };
    // do await this, since we want to know it's sent.
    await sendMessage(finishedMsg);
    process.exit(clean ? 0 : 1);
};
/**
 * All ts files are prebuilt by the main process. This registers a handler where
 * require('test/foo.ts') will be dealt with as require('<buildDir/test/foo.js')
 */
const registerShadowedTs = (conf) => {
    // tslint:disable-next-line: no-object-mutation
    const jsHandler = require.extensions['.js'];
    require.extensions['.ts'] = (m, filename) => {
        const _compile = m._compile;
        // tslint:disable-next-line: no-object-mutation
        m._compile = function (code, fileName) {
            const jsName = fileName.replace(/\.ts$/, '.js');
            const rel = path_1.default.relative(process.cwd(), jsName);
            const prebuilt = path_1.default.join(process.cwd(), conf.buildDir, rel);
            const js = fs_1.default.readFileSync(prebuilt, 'utf-8');
            return _compile.call(this, js, filename);
        };
        return jsHandler(m, filename);
    };
};
/** foo/bar/baz.txt -> bar/baz.txt */
const fileNameWithParent = (filePath) => {
    const [file, parent] = filePath.split(path_1.default.sep).reverse();
    return path_1.default.join(parent, file);
};
const doTest = (testFile) => {
    const testFileName = fileNameWithParent(testFile.filePath);
    const tests = testFile.tests;
    if (!tests.length) {
        sendMessage({
            kind: 'test_error',
            reason: `${testFileName}: No tests found`,
        });
        return Promise.resolve([]);
    }
    const all = tests.map(async ({ name, before, testfn, after }, index) => {
        const testCase = {
            title: name,
            fileName: testFileName,
            index,
        };
        // run before and save the args
        const args = await tryRun(testFileName, name, before);
        if (isFail(args)) {
            console.error(`Error before ${name} in ${testFileName}: ${formatError(args.error)}`);
            return {
                name,
                filename: testFileName,
                fail: true,
                error: args.error,
                duration: 0,
            };
        }
        const testResult = await tryRun(testFileName, name, async () => {
            sendMessage({
                kind: 'test_start',
                payload: testCase,
            });
            const startedAt = Date.now();
            await testfn(args);
            const duration = Date.now() - startedAt;
            return {
                name,
                filename: testFileName,
                fail: false,
                duration,
            };
        });
        sendMessage({
            kind: 'test_result',
            payload: {
                testCase,
                passed: !testResult.fail,
                error: testResult.error
                    ? serialize_error_1.serializeError(testResult.error)
                    : undefined,
                duration: testResult.duration,
            },
        });
        // always run AFTER, regardless of testResult.
        await tryRun(testFileName, name, () => after
            ? after(args).catch((err) => {
                console.log(`Error after ${name} in ${testFileName}: ${formatError(err)}`);
            })
            : undefined);
        return testResult;
    });
    return Promise.all(all);
};
const isFail = (t) => !!t && !!t.fail;
const tryRun = (testFile, name, fn) => Promise.resolve()
    .then(fn)
    .catch((err) => ({
    name,
    fail: true,
    filename: testFile,
    error: err,
    duration: 0,
}));
const formatError = (e) => {
    if (e instanceof Error) {
        if (e.stack) {
            const c = e.stack.split('\n');
            const t = e instanceof assert_1.AssertionError ? e.message : c[0];
            return [t, c[1]].join('\n');
        }
        else {
            return e.message;
        }
    }
    return e;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQXdDO0FBT3hDLDJDQUF3QztBQUN4QywyREFBdUQ7QUFDdkQsNENBQW9CO0FBMEVwQixtREFBbUQ7QUFDdEMsUUFBQSxVQUFVLEdBQWMsRUFBRSxDQUFDO0FBRXhDLE1BQU0sV0FBVyxHQUFHLEtBQUssRUFBRSxHQUFZLEVBQWlCLEVBQUU7SUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7UUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7UUFDMUQsT0FBTztLQUNWO0lBQ0QsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDLENBQUM7QUFFRiw0QkFBNEI7QUFDZixRQUFBLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBYSxFQUFpQixFQUFFO0lBQzNELGtDQUFrQztJQUNsQyxJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUM5QixrQ0FBa0M7SUFDbEMsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFFL0IsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0Ms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