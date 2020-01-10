import child_process from 'child_process';
import path from 'path';
import { scan } from './lib/scan';
import { Message } from './child';
import { Reporter } from './reporters';
import TAPReporter from './reporters/tap-reporter';
import LolTestReporter from './reporters/loltest-reporter';
import LolTest2Reporter from './reporters/loltest2-reporter';

const reporters: { [key: string]: Reporter } = {
    tap: TAPReporter,
    loltest: LolTestReporter,
    loltest2: LolTest2Reporter,
};

export interface RunConfiguration {
    testDir: string;
    reporter?: string;
    filter?: string;
    testFilter?: string;
}

/** The main process which forks child processes for each test. */
export const runMain = (self: string, config: RunConfiguration) => {
    const target = findTarget(config.testDir, config.filter);
    const params = [
        '--child-runner',
        target,
        ...(config.testFilter ? ['--test-filter', config.testFilter] : []),
    ];

    const reporter = reporters[config.reporter || 'loltest'];

    const child = child_process.fork(self, params, {
        // See https://nodejs.org/api/child_process.html#child_process_options_stdio
        // We pipe stdin, stdout, stderr between the parent and child process,
        // and enable IPC (Inter Process Communication) to pass messages.
        stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
    });

    child.on('message', (m: Message) => handleChildMessage(reporter, m));

    child.on('exit', (childExit) => {
        // die when child dies.
        const code = childExit ? childExit : 0;
        process.exit(code);
    });
};

const handleChildMessage = (reporter: Reporter, message: Message) => {
    switch (message.kind) {
        case 'run_start':
            console.log(reporter.onRunStart(message.payload));
            return;
        case 'test_start':
            const startOutput = reporter.onTestStart(message.payload);
            startOutput && console.log(startOutput);
            return;
        case 'test_result':
            const result = reporter.onTestResult(message.payload);
            result && console.log(result);
            return;
        case 'run_complete':
            console.log(reporter.onRunComplete(message.payload));
            return;
        case 'test_error':
            console.error(reporter.onError(message.reason, message.error));
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
