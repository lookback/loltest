import fs from 'fs';
import path from 'path';
import { AssertionError } from 'assert';
import { scan } from './main';
import { Reporter } from './reporters';
import LolTestReporter from './reporters/loltest-reporter';

export interface RunConf {
    target: string;
}

export interface TestRun {
    name: string;
    before?: () => any;
    testfn: (a?: any) => any;
    after?: (a?: any) => any;
}

interface TestFile {
    filePath: string;
    tests: TestRun[];
}

// test() puts tests into here.
export const foundTests: TestRun[] = [];

const flatten = <T>(arr: T[][]): T[] =>
    Array.prototype.concat.apply([], arr);

// Child process test runner
export const runChild = async (conf: RunConf): Promise<void> => {
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

    const reporter = LolTestReporter;

    const testFilePaths = getTestPaths(conf.target);

    const testFiles: TestFile[] = testFilePaths.map<TestFile>(testPath => {
        require(testPath);

        return {
            filePath: testPath,
            tests: foundTests.splice(0, foundTests.length),
        };
    });

    console.log(reporter.startRun({
        numFiles: testFiles.length,
        total: testFiles.reduce((acc, testFile) => acc + testFile.tests.length, 0),
    }));

    const allTests = testFiles.map((testFile) => doTest(testFile, reporter));

    Promise.all(allTests)
        .then((results) => {
            const flat: boolean[] = flatten(results);
            const allGood = flat.reduce((p: boolean, c) => p && c, false);
            const clean = allGood && !uncaughtException && !unhandledRejection;

            console.log(reporter.finishRun({
                total: flat.length,
                passed: flat.filter(p => p).length,
                failed: flat.filter(p => !p).length,
            }));

            process.exit(clean ? 0 : 1);
        });
};

const getTestPaths = (target: string): string[] => {
    try {
        const stat = fs.statSync(target);

        if (stat.isFile()) {
            return [target];
        } else if (stat.isDirectory()) {
            return scan(target).map(n => path.join(target, n));
        }

        throw new Error('Neither file nor directory');

    } catch (err) {
        console.error(`Cannot find directory: ${target}`);
        return process.exit(1);
    }
};

const doTest = (testFile: TestFile, reporter: Reporter): Promise<boolean[]> => {
    const testFileName = path.basename(testFile.filePath);
    const tests = testFile.tests;

    if (!tests.length) {
        console.log(`${testFileName}:`, 'No tests found');
        return Promise.resolve([]);
    }

    const all = tests.map(
        async ({ name, before, testfn, after }, index): Promise<TestResult> => {

        // run before and save the args
        const args = await tryRun(testFileName, name, before);

        if (isFail(args)) {
            console.log(`Error before ${name} in ${testFileName}: ${formatError(args.error)}`);

            return {
                name,
                fail: true,
                error: args.error,
            };
        }

        const testResult = await tryRun<TestResult>(testFileName, name, async () => {
            await testfn(args);

            return {
                name,
                fail: false,
            };
        });

        const report = reporter.test(testResult.name, {
            index,
            fileName: testFileName,
            passed: !testResult.fail,
            error: testResult.error,
        });

        // Main printout for this test
        console.log(report);

        // always run AFTER, regardless of testResult.
        await tryRun(testFileName, name, () =>
            after ? after(args).catch((err: any) => {
                console.log(`Error after ${name} in ${testFileName}: ${formatError(err)}`);
            }) : undefined
        );

        return testResult;
    });

    return Promise.all(all).then(results => results.map(r => !r.fail));
};

interface TestResult {
    name: string;
    fail: boolean;
    error?: Error;
}

interface Fail extends TestResult {
    fail: true;
    error: Error;
}

const isFail = (t: any): t is Fail => !!t && !!t.fail;

const tryRun = <T>(
    testFile: string,
    name: string,
    fn: (() => Promise<T>) | undefined,
): Promise<T | TestResult> => Promise.resolve().then(fn)
    .catch((err): TestResult => ({
        name,
        fail: true,
        error: err,
    }));

const formatError = (e: any): string => {
    if (e instanceof Error) {
        if (e.stack) {
            const c = e.stack.split('\n');
            const t = e instanceof AssertionError ? e.message : c[0];
            return [t, c[1]].join('\n');
        } else {
            return e.message;
        }
    }

    return e;
};

