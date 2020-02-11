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
    const allTests = testFiles.map(f => doTest(f, conf.testNameFilter));
    const results = await Promise.all(allTests);
    const flat = flatten_1.flatten(results);
    const testsAsBooleans = flat.map((t) => !t.fail);
    const allGood = testsAsBooleans.every((p) => p);
    const clean = allGood && !uncaughtException && !unhandledRejection;
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
/** Returns tests where their name matches the regex. */
const applyTestNameFilter = (tests, regex) => tests.filter(t => regex.test(t.name));
const doTest = (testFile, filter) => {
    const testFileName = fileNameWithParent(testFile.filePath);
    const tests = filter
        ? applyTestNameFilter(testFile.tests, new RegExp(filter))
        : testFile.tests;
    if (!tests.length) {
        sendMessage({
            kind: 'test_error',
            error: `${testFileName}: No tests found. Filter: ${filter || 'none'}`,
        });
        return Promise.resolve([]);
    }
    const all = tests.map(async ({ name, before, testfn, after }, index) => {
        const testCase = {
            title: name,
            fileName: testFileName,
            index,
        };
        const testMeta = {
            testFileName,
            testCaseName: name,
        };
        // run before and save the args
        const args = await tryRun(testFileName, name, () => before && before(testMeta)) || {};
        // tslint:disable-next-line: no-object-mutation
        Object.assign(args, testMeta);
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
        await tryRun(testFileName, name, () => after && after(args)
            .catch((err) => {
            console.log(`Error after ${name} in ${testFileName}: ${formatError(err)}`);
        }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsbUNBQXdDO0FBTXhDLDJDQUF3QztBQUN4QywyREFBdUQ7QUFDdkQsNENBQW9CO0FBNEVwQixtREFBbUQ7QUFDdEMsUUFBQSxVQUFVLEdBQWMsRUFBRSxDQUFDO0FBRXhDLE1BQU0sV0FBVyxHQUFHLEtBQUssRUFBRSxHQUFZLEVBQWlCLEVBQUU7SUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7UUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7UUFDMUQsT0FBTztLQUNWO0lBQ0QsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDLENBQUM7QUFFRiw0QkFBNEI7QUFDZixRQUFBLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBYSxFQUFpQixFQUFFO0lBQzNELGtDQUFrQztJQUNsQyxJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUM5QixrQ0FBa0M7SUFDbEMsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFFL0IsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0Ms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