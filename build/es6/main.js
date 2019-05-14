import child_process from 'child_process';
import path from 'path';
import { scan } from './lib/scan';
import TAPReporter from './reporters/tap-reporter';
import LolTestReporter from './reporters/loltest-reporter';
const reporters = {
    tap: TAPReporter,
    loltest: LolTestReporter,
};
/** The main process which forks child processes for each test. */
export const runMain = (self, config) => {
    const target = findTarget(config.testDir, config.filter);
    const params = ['--child-runner', target];
    const reporter = config.reporter ? reporters[config.reporter] : reporters.loltest;
    if (!reporter) {
        console.error('Unknown reporter:', config.reporter);
        process.exit(1);
    }
    const child = child_process.fork(self, params, {
        // See https://nodejs.org/api/child_process.html#child_process_options_stdio
        // We pipe stdin, stdout, stderr between the parent and child process,
        // and enable IPC (Inter Process Communication) to pass messages.
        stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
    });
    child.on('message', (m) => handleChildMessage(reporter, m));
    child.on('exit', childExit => {
        // die when child dies.
        const code = childExit ? childExit : 0;
        process.exit(code);
    });
};
const handleChildMessage = (reporter, message) => {
    switch (message.kind) {
        case 'test_started':
            console.log(reporter.startRun(message.payload));
            return;
        case 'test_result':
            const output = reporter.test(message.payload);
            output && console.log(output);
            return;
        case 'test_finished':
            console.log(reporter.finishRun(message.payload));
            return;
        case 'test_error_message':
            console.error(reporter.bail(message.error && message.error.message));
            return;
    }
    ((x) => { })(message); // assert exhaustive
};
/** Find a target to start child process from. */
export const findTarget = (testDir, filter) => {
    if (filter) {
        const jsFiles = scan(testDir);
        const file = jsFiles.find(f => f.startsWith(filter));
        if (file) {
            return path.join(testDir, file);
        }
        else {
            console.error("No test file found for:", filter);
            process.exit(1);
        }
    }
    return testDir;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sYUFBYSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUdsQyxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLGVBQWUsTUFBTSw4QkFBOEIsQ0FBQztBQUUzRCxNQUFNLFNBQVMsR0FBK0I7SUFDMUMsR0FBRyxFQUFFLFdBQVc7SUFDaEIsT0FBTyxFQUFFLGVBQWU7Q0FDM0IsQ0FBQztBQVFGLGtFQUFrRTtBQUNsRSxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFZLEVBQUUsTUFBd0IsRUFBRSxFQUFFO0lBQzlELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6RCxNQUFNLE1BQU0sR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRTFDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7SUFFbEYsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFFRCxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDM0MsNEVBQTRFO1FBQzVFLHNFQUFzRTtRQUN0RSxpRUFBaUU7UUFD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