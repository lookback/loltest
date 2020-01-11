import child_process from 'child_process';
import path from 'path';
import { scan } from './lib/scan';
import { Message } from './child';
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
    reporter?: string;
    filter?: string;
    testFilter?: string;
}

/** The main process which forks child processes for each test. */
export const runMain = (self: string, config: RunConfiguration) => {
    const target = findTarget(config.testDir, config.filter);
    const testFiles = getTestFiles(target);

    const reporter = reporters[config.reporter || 'loltest'];
    const output: Output = (msg) => typeof msg === 'string' && console.log(msg);

    // compile ts to be reused by each child.
    compileTs(testFiles, config, reporter, output);

    const maxChildCount = config.maxChildCount;
    const todo = testFiles
        .map((t) => t.replace(/\.(ts|js)$/, '.ts'))
        .map((t) => path.join(process.cwd(), t));
    // tslint:disable-next-line:no-let
    let running = 0;

    const runNext = (): boolean => {
        if (running >= maxChildCount || !todo.length) {
            return false;
        }

        running++;

        const next = todo.shift()!;
        const params = ['--child-runner', next, '--build-dir', config.buildDir];

        const child = child_process.fork(self, params, {
            // See https://nodejs.org/api/child_process.html#child_process_options_stdio
            // We pipe stdin, stdout, stderr between the parent and child process,
            // and enable IPC (Inter Process Communication) to pass messages.
            stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
        });

        child.on('message', (m: Message) =>
            handleChildMessage(reporter, m, output)
        );

        child.on('exit', (childExit) => {
            // die on first child exiting with non-null.
            if (childExit && childExit !== 0) {
                process.exit(childExit);
            }

            running--;

            runNext();
        });

        return true;
    };

    // start as many as we're allowed
    while (runNext()) {}
};

const handleChildMessage = (
    reporter: Reporter,
    message: Message,
    out: Output
) => {
    switch (message.kind) {
        case 'run_start':
            reporter.onRunStart(message.payload, out);
            return;
        case 'test_start':
            reporter.onTestStart(message.payload, out);
            return;
        case 'test_result':
            reporter.onTestResult(message.payload, out);
            return;
        case 'run_complete':
            reporter.onRunComplete(message.payload, out);
            return;
        case 'test_error':
            reporter.onError(message.reason, message.error, out);
            return;
    }
    ((x: never) => {})(message); // assert exhaustive
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
