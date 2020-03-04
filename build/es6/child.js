import path from 'path';
import { AssertionError } from 'assert';
import { flatten } from './lib/flatten';
import { serializeError } from './lib/serialize-error';
import fs from 'fs';
// test() puts tests into here. This is *per file*.
export const foundTests = [];
const sendMessage = async (msg) => {
    if (!process.send) {
        console.warn('Not in child process, cannot send message');
        return;
    }
    await new Promise((rs) => process.send(msg, rs));
};
// Child process test runner
export const runChild = async (conf) => {
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
            tests: foundTests.splice(0, foundTests.length),
        };
    });
    const allTests = testFiles.map(f => doTest(f, conf.testNameFilter));
    const results = await Promise.all(allTests);
    const flat = flatten(results);
    const testsAsBooleans = flat.map((t) => !t.fail);
    const allGood = testsAsBooleans.every((p) => p);
    const clean = allGood && !uncaughtException && !unhandledRejection;
    console.log('process.exit', clean, testFiles[0].filePath);
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
            const rel = path.relative(process.cwd(), jsName);
            const prebuilt = path.join(process.cwd(), conf.buildDir, rel);
            const js = fs.readFileSync(prebuilt, 'utf-8');
            return _compile.call(this, js, filename);
        };
        return jsHandler(m, filename);
    };
};
/** foo/bar/baz.txt -> bar/baz.txt */
const fileNameWithParent = (filePath) => {
    const [file, parent] = filePath.split(path.sep).reverse();
    return path.join(parent, file);
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
    console.log('start', testFile.filePath);
    const all = tests.map(async ({ name, before, testfn, after }, index) => {
        console.log('inside 1', testFile.filePath);
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
        console.log('inside 2', testFile.filePath);
        // tslint:disable-next-line: no-object-mutation
        Object.assign(args, testMeta);
        if (isFail(args)) {
            console.error(`Error before ${name} in ${testFileName}: ${formatError(args.error)}`);
            console.log('inside 3', testFile.filePath);
            return {
                name,
                filename: testFileName,
                fail: true,
                error: args.error,
                duration: 0,
            };
        }
        console.log('inside 4', testFile.filePath);
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
        console.log('inside 5', testFile.filePath);
        sendMessage({
            kind: 'test_result',
            payload: {
                testCase,
                passed: !testResult.fail,
                error: testResult.error
                    ? serializeError(testResult.error)
                    : undefined,
                duration: testResult.duration,
            },
        });
        console.log('inside 6', testFile.filePath);
        // always run AFTER, regardless of testResult.
        await tryRun(testFileName, name, () => after && after(args)
            .catch((err) => {
            console.log(`Error after ${name} in ${testFileName}: ${formatError(err)}`);
        }));
        console.log('inside 7', testFile.filePath);
        return testResult;
    });
    return Promise.all(all).catch(e => {
        console.error("Unhandled error in child runner", e);
        throw e;
    }).then(v => {
        console.log('return', testFile.filePath);
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
            const t = e instanceof AssertionError ? e.message : c[0];
            return [t, c[1]].join('\n');
        }
        else {
            return e.message;
        }
    }
    return e;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2hpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFNeEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdkQsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBNEVwQixtREFBbUQ7QUFDbkQsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFjLEVBQUUsQ0FBQztBQUV4QyxNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQUUsR0FBWSxFQUFpQixFQUFFO0lBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1FBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBQzFELE9BQU87S0FDVjtJQUNELE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFDO0FBRUYsNEJBQTRCO0FBQzVCLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBYSxFQUFpQixFQUFFO0lBQzNELGtDQUFrQztJQUNsQyxJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUM5QixrQ0FBa0M7SUFDbEMsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFFL0IsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsaUJBQWlCLEdBQUcsSUFBSSxDQUFD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