"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const assert_1 = require("assert");
const scan_1 = require("./lib/scan");
const flatten_1 = require("./lib/flatten");
const serialize_error_1 = require("./lib/serialize-error");
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
    let uncaughtException = false, unhandledRejection = false;
    process.on('uncaughtException', (e) => {
        console.log('Uncaught exception:', e);
        uncaughtException = true;
    });
    process.on('unhandledRejection', (e) => {
        console.log('Unhandled promise rejection:', e);
        unhandledRejection = true;
    });
    const testFilePaths = getTestPaths(conf.target);
    const allTestFiles = testFilePaths.map(testPath => {
        require(testPath);
        return {
            filePath: testPath,
            // "foundTests" is now filled with TestRuns. Remove them from the array
            // for next test file.
            tests: exports.foundTests.splice(0, exports.foundTests.length),
        };
    });
    const testFiles = !!conf.testFilter
        ? getFilteredTests(allTestFiles, conf.testFilter)
        : allTestFiles;
    await sendMessage({
        kind: 'test_started',
        payload: {
            numFiles: testFiles.length,
            total: testFiles.reduce((acc, testFile) => acc + testFile.tests.length, 0),
        },
    });
    const startTime = Date.now();
    const allTests = testFiles.map(doTest);
    const results = await Promise.all(allTests);
    const flat = flatten_1.flatten(results);
    const testsAsBooleans = flat.map(t => !t.fail);
    const allGood = testsAsBooleans.every(p => p);
    const clean = allGood && !uncaughtException && !unhandledRejection;
    const finishedMsg = {
        kind: 'test_finished',
        payload: {
            total: testsAsBooleans.length,
            passed: testsAsBooleans.filter(p => p).length,
            failed: testsAsBooleans.filter(p => !p).length,
            duration: Date.now() - startTime,
        },
    };
    await sendMessage(finishedMsg);
    process.exit(clean ? 0 : 1);
};
/** Apply a text filter on **test case** titles in a list of files. Only test files
 * whose test cases pass the filter will be returned.
 */
const getFilteredTests = (testFiles, filter) => {
    const re = new RegExp(filter);
    return testFiles
        .map(t => ({
        ...t,
        tests: t.tests.filter(tt => re.test(tt.name)),
    }))
        .filter(t => t.tests.length > 0);
};
const getTestPaths = (target) => {
    try {
        const stat = fs_1.default.statSync(target);
        if (stat.isFile()) {
            return [target];
        }
        else if (stat.isDirectory()) {
            return scan_1.scan(target).map(n => path_1.default.join(target, n));
        }
        throw new Error('Neither file nor directory');
    }
    catch (err) {
        console.error(`Cannot find directory: ${target}`);
        return process.exit(1);
    }
};
/** foo/bar/baz.txt -> bar/baz.txt */
const fileNameWithParent = (filePath) => {
    const [file, parent,] = filePath.split(path_1.default.sep).reverse();
    return path_1.default.join(parent, file);
};
const doTest = (testFile) => {
    const testFileName = fileNameWithParent(testFile.filePath);
    const tests = testFile.tests;
    if (!tests.length) {
        sendMessage({
            kind: 'test_error_message',
            reason: `${testFileName}: No tests found`,
        });
        return Promise.resolve([]);
    }
    const all = tests.map(async ({ name, before, testfn, after }, index) => {
        // run before and save the args
        const args = await tryRun(testFileName, name, before);
        if (isFail(args)) {
            console.log(`Error before ${name} in ${testFileName}: ${formatError(args.error)}`);
            return {
                name,
                filename: testFileName,
                fail: true,
                error: args.error,
                duration: 0,
            };
        }
        const testResult = await tryRun(testFileName, name, async () => {
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
                title: testResult.name,
                fileName: testResult.filename,
                passed: !testResult.fail,
                index,
                error: testResult.error ? serialize_error_1.serializeError(testResult.error) : undefined,
                duration: testResult.duration,
            },
        });
        // always run AFTER, regardless of testResult.
        await tryRun(testFileName, name, () => after ? after(args).catch((err) => {
            console.log(`Error after ${name} in ${testFileName}: ${formatError(err)}`);
        }) : undefined);
        return testResult;
    });
    return Promise.all(all);
};
const isFail = (t) => !!t && !!t.fail;
const tryRun = (testFile, name, fn) => Promise.resolve().then(fn)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsZ0RBQXdCO0FBQ3hCLG1DQUF3QztBQUN4QyxxQ0FBa0M7QUFFbEMsMkNBQXdDO0FBQ3hDLDJEQUF1RDtBQW9FdkQsbURBQW1EO0FBQ3RDLFFBQUEsVUFBVSxHQUFjLEVBQUUsQ0FBQztBQUV4QyxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQUUsR0FBWSxFQUFpQixFQUFFO0lBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBQzFELE9BQU87S0FDVjtJQUNELE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFDO0FBRUYsNEJBQTRCO0FBQ2YsUUFBQSxRQUFRLEdBQUcsS0FBSyxFQUFFLElBQWEsRUFBaUIsRUFBRTtJQUMzRCxrQ0FBa0M7SUFDbEMsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLEVBQUUsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBRTFELE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLGtCQUFrQixHQUFH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