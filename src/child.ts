import fs from 'fs';
import path from 'path';
import { AssertionError } from 'assert';
import { scan } from "./lib/scan";
import { TestCaseReport, ReporterStats, ReporterStart } from './reporters';
import { flatten } from './lib/flatten';
import { serializeError } from './lib/serialize-error';

export interface RunConf {
    target: string;
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

// test() puts tests into here.
export const foundTests: TestRun[] = [];

const sendMessage = (msg: Message) => {
    if (process.send) process.send(msg);
    else console.warn('Not in child process, cannot send message');
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

    const testFiles: TestFile[] = testFilePaths.map<TestFile>(testPath => {
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

            sendMessage(finishedMsg);

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

