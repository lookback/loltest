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
    console.log('here', tests.length);
    const all = tests.map(async ({ name, before, testfn, after }, index) => {
        console.log('inside', tests.length);
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
    return Promise.all(all).catch(e => {
        console.error("Unhandled error in child runner", e);
        throw e;
    })
        .then(v => {
        console.info("Finished with value", v);
        return v;
    });
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