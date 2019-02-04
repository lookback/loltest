import child_process from 'child_process';
import path from 'path';
import { scan } from './lib/scan';
import { Message } from './child';
import LolTestReporter from './reporters/loltest-reporter';
import { Reporter } from './reporters';

/** The main process which forks child processes for each test. */
export const runMain = (self: string, testDir: string, filter: string) => {
    const target = findTarget(testDir, filter);
    const params = ['--child-runner', target];

    const reporter = LolTestReporter;

    const child = child_process.fork(self, params, {
        // See https://nodejs.org/api/child_process.html#child_process_options_stdio
        // We pipe stdin, stdout, stderr between the parent and child process,
        // and enable IPC (Inter Process Communication) to pass messages.
        stdio: [ process.stdin, process.stdout, process.stderr, 'ipc' ],
    });

    child.on('message', (m: Message) => handleChildMessage(reporter, m));

    child.on('exit', childExit => {
        // die when child dies.
        const code = childExit ? childExit : 0;
        process.exit(code);
    });
};

const handleChildMessage = (reporter: Reporter, message: Message) => {
    switch (message.kind) {
        case 'test_started':
            console.log(reporter.startRun(message.payload));
            return;
        case 'test_result':
            console.log(reporter.test(message.payload));
            return;
        case 'test_finished':
            console.log(reporter.finishRun(message.payload));
            return;
        case 'test_error_message':
            console.error(reporter.bail(message.error && message.error.message));
            return;
    }
    ((x: never) => { })(message); // assert exhaustive
};

/** Find a target to start child process from. */
export const findTarget = (testDir: string, filter: string): string => {
    if (filter) {
        const jsFiles = scan(testDir);
        const file = jsFiles.find(f => f.startsWith(filter));
        if (file) {
            return path.join(testDir, file);
        } else {
            console.error("No test file found for:", filter);
            process.exit(1);
        }
    }
    return testDir;
};


