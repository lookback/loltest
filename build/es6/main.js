import child_process from 'child_process';
import path from 'path';
import { scan } from './lib/scan';
import TAPReporter from './reporters/tap-reporter';
import LolTestReporter from './reporters/loltest-reporter';
import LolTest2Reporter from './reporters/loltest2-reporter';
import fs from 'fs';
import { compileTs } from './compile';
const reporters = {
    tap: TAPReporter,
    loltest: LolTestReporter,
    loltest2: LolTest2Reporter,
};
/** The main process which forks child processes for each test. */
export const runMain = (self, config) => {
    const target = findTarget(config.testDir, config.filter);
    const testFiles = getTestFiles(target);
    const reporter = reporters[config.reporter] || LolTestReporter;
    const output = (msg) => typeof msg === 'string' && console.log(msg);
    const handleReporterMsg = (message) => {
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
        ((x) => { })(message); // assert exhaustive
    };
    // compile ts to be reused by each child.
    compileTs(testFiles, config, reporter, output);
    const maxChildCount = config.maxChildCount;
    const todo = testFiles
        .map((t) => t.replace(/\.(ts|js)$/, '.ts'))
        .map((t) => path.join(process.cwd(), t));
    // tslint:disable-next-line:no-let
    let running = 0;
    handleReporterMsg({
        kind: 'run_start',
        payload: {
            numFiles: testFiles.length,
            maxChildCount,
        },
    });
    // tslint:disable-next-line: no-let
    let files_done = 0;
    const runNext = () => {
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
        const next = todo.shift();
        const params = [
            '--child-runner', next,
            '--build-dir', config.buildDir,
            ...(config.testFilter ? ['--test-filter', config.testFilter] : []),
        ];
        const child = child_process.fork(self, params, {
            // See https://nodejs.org/api/child_process.html#child_process_options_stdio
            // We pipe stdin, stdout, stderr between the parent and child process,
            // and enable IPC (Inter Process Communication) to pass messages.
            stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
        });
        child.on('message', (m) => handleReporterMsg(m));
        child.on('exit', (childExit) => {
            // die on first child exiting with non-null.
            if (childExit && childExit !== 0) {
                handleReporterMsg({
                    kind: 'run_complete',
                });
                process.exit(childExit);
            }
            console.log('finished', next);
            files_done++;
            running--;
            runNext();
        });
        return true;
    };
    // start as many as we're allowed
    while (runNext()) { }
};
/** Find a target to start child process from. */
export const findTarget = (testDir, filter) => {
    if (filter) {
        const jsFiles = scan(testDir);
        const possible = jsFiles.filter((f) => f.startsWith(filter));
        possible.sort((f1, f2) => f1.length - f2.length);
        const file = possible[0]; // shortest wins
        if (file) {
            return path.join(testDir, file);
        }
        else {
            console.error('No test file found for:', filter);
            process.exit(1);
        }
    }
    return testDir;
};
const getTestFiles = (target) => {
    try {
        const stat = fs.statSync(target);
        if (stat.isFile()) {
            return [target];
        }
        else if (stat.isDirectory()) {
            return scan(target).map((n) => path.join(target, n));
        }
        throw new Error('Neither file nor directory');
    }
    catch (err) {
        console.error(`Cannot find directory: ${target}`);
        return process.exit(1);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sYUFBYSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUdsQyxPQUFPLFdBQVcsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRCxPQUFPLGVBQWUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRCxPQUFPLGdCQUFnQixNQUFNLCtCQUErQixDQUFDO0FBQzdELE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQztBQUNwQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRXRDLE1BQU0sU0FBUyxHQUFnQztJQUMzQyxHQUFHLEVBQUUsV0FBVztJQUNoQixPQUFPLEVBQUUsZUFBZTtJQUN4QixRQUFRLEVBQUUsZ0JBQWdCO0NBQzdCLENBQUM7QUFhRixrRUFBa0U7QUFDbEUsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLE1BQXdCLEVBQUUsRUFBRTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekQsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXZDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksZUFBZSxDQUFDO0lBQy9ELE1BQU0sTUFBTSxHQUFXLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU1RSxNQUFNLGlCQUFpQixHQUFHLENBQ3RCLE9BQWdCLEVBQ2xCLEVBQUU7UUFDQSxRQUFRLE9B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