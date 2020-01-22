import path from 'path';
import { AssertionError } from 'assert';
import {
    TestCaseReport,
    ReporterStart,
    TestCase,
} from './reporters';
import { flatten } from './lib/flatten';
import { serializeError } from './lib/serialize-error';
import fs from 'fs';

export interface RunConf {
    target: string;
    buildDir: string;
    testNameFilter?: string;
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
    | RunCompleteMessage
    | RunStartMessage
    | TestErrorMessage
    | TestStartMessage;

export interface TestStartMessage {
    kind: 'test_start';
    payload: TestCase;
}

export interface TestResultMessage {
    kind: 'test_result';
    payload: TestCaseReport;
}

export interface RunCompleteMessage {
    kind: 'run_complete';
}

export interface RunStartMessage {
    kind: 'run_start';
    payload: ReporterStart;
}

export interface TestErrorMessage {
    kind: 'test_error';
    // We can't use Error constructor here, as it can't be serialised
    // between processes.
    error: string;
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

    const testFiles: TestFile[] = testFilePaths.map<TestFile>((testPath) => {
        require(testPath);

        return {
            filePath: testPath,
            // "foundTests" is now filled with TestRuns. Remove them from the array
            // for next test file.
            tests: foundTests.splice(0, foundTests.length),
        };
    });

    const allTests = testFiles.map(f =>
        doTest(f, conf.testNameFilter)
    );

    const results = await Promise.all(allTests);
    const flat = flatten(results);

    const testsAsBooleans: boolean[] = flat.map((t) => !t.fail);
    const allGood = testsAsBooleans.every((p) => p);
    const clean = allGood && !uncaughtException && !unhandledRejection;

    process.exit(clean ? 0 : 1);
};

/**
 * All ts files are prebuilt by the main process. This registers a handler where
 * require('test/foo.ts') will be dealt with as require('<buildDir/test/foo.js')
 */
const registerShadowedTs = (conf: RunConf) => {
    // tslint:disable-next-line: no-object-mutation
    const jsHandler = require.extensions['.js'];
    require.extensions['.ts'] = (m: NodeModule, filename: string) => {
        const _compile = (<any>m)._compile;
        // tslint:disable-next-line: no-object-mutation
        (<any>m)._compile = function(code: string, fileName: string): any {
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
const fileNameWithParent = (filePath: string) => {
    const [file, parent] = filePath.split(path.sep).reverse();
    return path.join(parent, file);
};

/** Returns tests where their name matches the regex. */
const applyTestNameFilter = (tests: TestRun[], regex: RegExp) =>
    tests.filter(t => regex.test(t.name));

const doTest = (testFile: TestFile, filter?: string): Promise<TestResult[]> => {
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

    const all = tests.map(
        async ({ name, before, testfn, after }, index): Promise<TestResult> => {
            const testCase = {
                title: name,
                fileName: testFileName,
                index,
            };

            // run before and save the args
            const args = await tryRun(testFileName, name, before);

            if (isFail(args)) {
                console.error(
                    `Error before ${name} in ${testFileName}: ${formatError(
                        args.error
                    )}`
                );

                return {
                    name,
                    filename: testFileName,
                    fail: true,
                    error: args.error,
                    duration: 0,
                };
            }

            const testResult = await tryRun<TestResult>(
                testFileName,
                name,
                async () => {
                    sendMessage(<TestStartMessage>{
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
                }
            );

            sendMessage(<TestResultMessage>{
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

            // always run AFTER, regardless of testResult.
            await tryRun(testFileName, name, () =>
                after
                    ? after(args).catch((err: any) => {
                          console.log(
                              `Error after ${name} in ${testFileName}: ${formatError(
                                  err
                              )}`
                          );
                      })
                    : undefined
            );

            return testResult;
        }
    );

    return Promise.all(all);
};

const isFail = (t: any): t is Fail => !!t && !!t.fail;

const tryRun = <T>(
    testFile: string,
    name: string,
    fn: (() => Promise<T>) | undefined
): Promise<T | TestResult> =>
    Promise.resolve()
        .then(fn)
        .catch(
            (err): TestResult => ({
                name,
                fail: true,
                filename: testFile,
                error: err,
                duration: 0,
            })
        );

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
