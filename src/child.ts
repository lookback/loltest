import fs from 'fs';
import path from 'path';
import { AssertionError } from 'assert';
import { scan } from "./lib/scan";
import { TestCaseReport, ReporterStats, ReporterStart } from './reporters';
import { flatten } from './lib/flatten';
import { serializeError } from './lib/serialize-error';

export interface RunConf {
    target: string;
    testFilter?: string;
}

/**
 * A single run of a test case.
 */
export interface TestRun {
    name: string;
    before?: () => any;
    testfn: (a?: any) => any;
    after?: (a?: any) => any;
}

/**
 * A file including test cases.
 */
interface TestFile {
    filePath: string;
    tests: TestRun[];
}

/**
 * The result of a TestRun.
 */
export interface TestResult {
    name: string;
    filename: string;
    fail: boolean;
    error?: Error;
    duration: number;
}

interface Fail extends TestResult {
    fail: true;
    error: Error;
}

export type Message =
    | TestResultMessage
    | TestFinishedMessage
    | TestStartedMessage
    | TestErrorMessage;

export interface TestResultMessage {
    kind: 'test_result';
    payload: TestCaseReport;
}

export interface TestFinishedMessage {
    kind: 'test_finished';
    payload: ReporterStats;
}

export interface TestStartedMessage {
    kind: 'test_started';
    payload: ReporterStart;
}

export interface TestErrorMessage {
    kind: 'test_error_message';
    error?: Error;
}

// test() puts tests into here. This is *per file*.
export const foundTests: TestRun[] = [];

const sendMessage = async (msg: Message): Promise<void> => {
    if (!process.send) {
        console.warn('Not in child process, cannot send message');
        return;
    }
    await new Promise((rs) => process.send!(msg, rs));
};

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

    const testFilePaths = getTestPaths(conf.target);

    const allTestFiles: TestFile[] = testFilePaths.map<TestFile>(testPath => {
        require(testPath);

        return {
            filePath: testPath,
            // "foundTests" is now filled with TestRuns. Remove them from the array
            // for next test file.
            tests: foundTests.splice(0, foundTests.length),
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
    const flat = flatten(results);

    const testsAsBooleans: boolean[] = flat.map(t => !t.fail);
    const allGood = testsAsBooleans.every(p => p);
    const clean = allGood && !uncaughtException && !unhandledRejection;

    const finishedMsg: TestFinishedMessage = {
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
const getFilteredTests = (testFiles: TestFile[], filter: string): TestFile[] => {
    const re = new RegExp(filter);

    return testFiles
        .map<TestFile>(t => ({
            ...t,
            tests: t.tests.filter(tt => re.test(tt.name)),
        }))
        .filter(t => t.tests.length > 0);
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

const doTest = (testFile: TestFile): Promise<TestResult[]> => {
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
                filename: testFileName,
                fail: true,
                error: args.error,
                duration: 0,
            };
        }

        const testResult = await tryRun<TestResult>(testFileName, name, async () => {
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
        await tryRun(testFileName, name, () =>
            after ? after(args).catch((err: any) => {
                console.log(`Error after ${name} in ${testFileName}: ${formatError(err)}`);
            }) : undefined
        );

        return testResult;
    });

    return Promise.all(all);
};

const isFail = (t: any): t is Fail => !!t && !!t.fail;

const tryRun = <T>(
    testFile: string,
    name: string,
    fn: (() => Promise<T>) | undefined,
): Promise<T | TestResult> => Promise.resolve().then(fn)
    .catch((err): TestResult => ({
        name,
        fail: true,
        filename: testFile,
        error: err,
        duration: 0,
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

