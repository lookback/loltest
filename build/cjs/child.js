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
// test() puts tests into here.
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
    const testFiles = testFilePaths.map(testPath => {
        require(testPath);
        return {
            filePath: testPath,
            tests: exports.foundTests.splice(0, exports.foundTests.length),
        };
    });
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
const doTest = (testFile) => {
    const testFileName = path_1.default.basename(testFile.filePath);
    const tests = testFile.tests;
    if (!tests.length) {
        console.log(`${testFileName}:`, 'No tests found');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsZ0RBQXdCO0FBQ3hCLG1DQUF3QztBQUN4QyxxQ0FBa0M7QUFFbEMsMkNBQXdDO0FBQ3hDLDJEQUF1RDtBQWtFdkQsK0JBQStCO0FBQ2xCLFFBQUEsVUFBVSxHQUFjLEVBQUUsQ0FBQztBQUV4QyxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQUUsR0FBWSxFQUFpQixFQUFFO0lBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBQzFELE9BQU87S0FDVjtJQUNELE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFDO0FBRUYsNEJBQTRCO0FBQ2YsUUFBQSxRQUFRLEdBQUcsS0FBSyxFQUFFLElBQWEsRUFBaUIsRUFBRTtJQUMzRCxrQ0FBa0M7SUFDbEMsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLEVBQUUsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBRTFELE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLGlCQUFpQixHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLGtCQUFrQixHQUFH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