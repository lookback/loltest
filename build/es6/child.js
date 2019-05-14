import fs from 'fs';
import path from 'path';
import { AssertionError } from 'assert';
import { scan } from "./lib/scan";
import { flatten } from './lib/flatten';
import { serializeError } from './lib/serialize-error';
// test() puts tests into here.
export const foundTests = [];
const sendMessage = (msg) => {
    if (process.send)
        process.send(msg);
    else
        console.warn('Not in child process, cannot send message');
};
// Child process test runner
export const runChild = async (conf) => {
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
            tests: foundTests.splice(0, foundTests.length),
        };
    });
    sendMessage({
        kind: 'test_started',
        payload: {
            numFiles: testFiles.length,
            total: testFiles.reduce((acc, testFile) => acc + testFile.tests.length, 0),
        },
    });
    const startTime = Date.now();
    const allTests = testFiles.map(async (testFile) => await doTest(testFile));
    Promise.all(allTests)
        .then((results) => {
        const flat = flatten(results);
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
        sendMessage(finishedMsg);
        process.exit(clean ? 0 : 1);
    });
};
const getTestPaths = (target) => {
    try {
        const stat = fs.statSync(target);
        if (stat.isFile()) {
            return [target];
        }
        else if (stat.isDirectory()) {
            return scan(target).map(n => path.join(target, n));
        }
        throw new Error('Neither file nor directory');
    }
    catch (err) {
        console.error(`Cannot find directory: ${target}`);
        return process.exit(1);
    }
};
const doTest = (testFile) => {
    const testFileName = path.basename(testFile.filePath);
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
                error: testResult.error ? serializeError(testResult.error) : undefined,
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
            const t = e instanceof AssertionError ? e.message : c[0];
            return [t, c[1]].join('\n');
        }
        else {
            return e.message;
        }
    }
    return e;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFbEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFrRXZELCtCQUErQjtBQUMvQixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWMsRUFBRSxDQUFDO0FBRXhDLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBWSxFQUFFLEVBQUU7SUFDakMsSUFBSSxPQUFPLENBQUMsSUFBSTtRQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUM7QUFFRiw0QkFBNEI7QUFDNUIsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLEtBQUssRUFBRSxJQUFhLEVBQWlCLEVBQUU7SUFDM0Qsa0NBQWtDO0lBQ2xDLElBQUksaUJBQWlCLEdBQUcsS0FBSyxFQUFFLGtCQUFrQixHQUFHLEtBQUssQ0FBQztJQUUxRCxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxFQUFF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