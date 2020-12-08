import child_process from 'child_process';
import path from 'path';
import { scan, scanPrefork } from './lib/scan';
import { Message, registerShadowedTs } from './child';
import { Reporter, Output } from './reporters';
import TAPReporter from './reporters/tap-reporter';
import LolTestReporter from './reporters/loltest-reporter';
import LolTest2Reporter from './reporters/loltest2-reporter';
import fs from 'fs';
import { compileTs } from './compile';

const reporters: { [key: string]: Reporter } = {
    tap: TAPReporter,
    loltest: LolTestReporter,
    loltest2: LolTest2Reporter,
};

export interface RunConfiguration {
    testDir: string;
    buildDir: string;
    maxChildCount: number;
    reporter: string;
    /** Filter for which test files to run. */
    filter: string | undefined;
    /** Filter for test names to run. Can be regex. */
    testFilter: string | undefined;
    /** If we are to go into watch mode instead of existing. */
    watch: boolean;
    /** If we are running in "js mode" with no typescript function. */
    js: boolean;
}

/** The main process which forks child processes for each test. */
export const runMain = (self: string, config: RunConfiguration) => {
    const target = findTarget(config.testDir, config.filter);
    const preforkFiles = findPrefork(config.testDir);
    const testFiles = getTestFiles(target);

    const reporter = reporters[config.reporter] || LolTestReporter;
    const output: Output = (msg) => typeof msg === 'string' && console.log(msg);

    const handleReporterMsg = (message: Message) => {
        switch (message.kind) {
            case 'run_start':
                reporter.onRunStart(message.payload, output);
                return;
            case 'test_start':
                reporter.onTestStart(message.payload, output);
                return;
            case 'test_result':
                reporter.onTestResult(message.payload, output);
                return;
            case 'run_complete':
                reporter.onRunComplete(output);
                return;
            case 'test_error':
                reporter.onError(message.error, output);
                return;
        }
        ((x: never) => {})(message); // assert exhaustive
    };

    const exitOnTestError = !config.watch;

    const doRunChildren = () =>
        runChildren(self, config, preforkFiles, testFiles, exitOnTestError, handleReporterMsg);

    const watchCallback = config.watch
        ? () => {
              reporter.reset();
              doRunChildren();
          }
        : undefined;

    if (!config.js) {
        // compile ts to be reused by each child.
        compileTs([...preforkFiles, ...testFiles], config, reporter, watchCallback, output);
    }

    // on launch always run tests.
    doRunChildren();

    if (watchCallback) {
        output(`Starting watch…`);
    }
};

const runChildren = (
    self: string,
    config: RunConfiguration,
    preforkFiles: string[],
    testFiles: string[],
    exitOnTestError: boolean,
    handleReporterMsg: (msg: Message) => void,
) => {
    const replacer: [RegExp, string] = config.js ? [/^$/, ''] : [/\.(ts|js)$/, '.ts'];

    // files that are to be run before forking to child processes
    const preforks = preforkFiles.map((t) => t.replace(...replacer)).map((t) => path.join(process.cwd(), t));

    registerShadowedTs(config.buildDir);

    // run them
    preforks.forEach((f) => require(f));

    const maxChildCount = config.maxChildCount;
    const todo = testFiles.map((t) => t.replace(...replacer)).map((t) => path.join(process.cwd(), t));

    let running = 0;

    handleReporterMsg({
        kind: 'run_start',
        payload: {
            numFiles: testFiles.length,
            maxChildCount,
        },
    });

    let files_done = 0;

    let child_ident = 0;

    const runNext = (): boolean => {
        if (running === 0 && files_done === testFiles.length) {
            handleReporterMsg({
                kind: 'run_complete',
            });
            return false;
        }

        if (running >= maxChildCount) {
            return false;
        }

        if (todo.length == 0) {
            return false;
        }

        running++;

        const ident = child_ident;
        child_ident++;

        const next = todo.shift()!;
        const params = [
            '--child-runner',
            next,
            '--build-dir',
            config.buildDir,
            '--ident',
            String(ident),
            ...(config.testFilter ? ['--test-filter', config.testFilter] : []),
        ];

        const child = child_process.fork(self, params, {
            // See https://nodejs.org/api/child_process.html#child_process_options_stdio
            // We pipe stdin, stdout, stderr between the parent and child process,
            // and enable IPC (Inter Process Communication) to pass messages.
            stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
        });

        child.on('message', (m: Message) => handleReporterMsg(m));

        child.on('exit', (childExit, signal) => {
            // die on first child exiting with non-null.
            if (childExit && childExit !== 0) {
                if (exitOnTestError) {
                    handleReporterMsg({
                        kind: 'run_complete',
                    });

                    process.exit(childExit);
                }
            }

            files_done++;
            running--;

            runNext();
        });

        return true;
    };

    // start as many as we're allowed
    while (runNext()) {}
};

/** Find a target to start child process from. */
export const findTarget = (testDir: string, filter?: string): string => {
    if (filter) {
        const jsFiles = scan(testDir);
        const possible = jsFiles.filter((f) => f.startsWith(filter));
        possible.sort((f1, f2) => f1.length - f2.length);
        const file = possible[0]; // shortest wins
        if (file) {
            return path.join(testDir, file);
        } else {
            console.error('No test file found for:', filter);
            process.exit(1);
        }
    }

    return testDir;
};

export const findPrefork = (testDir: string): string[] => {
    const preforks = scanPrefork(testDir);
    return preforks.map((f) => path.join(testDir, f));
};

const getTestFiles = (target: string): string[] => {
    try {
        const stat = fs.statSync(target);

        if (stat.isFile()) {
            return [target];
        } else if (stat.isDirectory()) {
            return scan(target).map((n) => path.join(target, n));
        }

        throw new Error('Neither file nor directory');
    } catch (err) {
        console.error(`Cannot find directory: ${target}`);
        return process.exit(1);
    }
};
