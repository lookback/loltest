import child_process from 'child_process';
import path from 'path';
import { scan, scanPrefork } from './lib/scan';
import { registerShadowedTs } from './child';
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
    const preforkFiles = findPrefork(config.testDir);
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
    compileTs([...preforkFiles, ...testFiles], config, reporter, output);
    // files that are to be run before forking to child processes
    const preforks = preforkFiles
        .map((t) => t.replace(/\.(ts|js)$/, '.ts'))
        .map((t) => path.join(process.cwd(), t));
    registerShadowedTs(config.buildDir);
    // run them
    preforks.forEach((f) => require(f));
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
    // tslint:disable-next-line: no-let
    let child_ident = 0;
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
        const ident = child_ident;
        child_ident++;
        const next = todo.shift();
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
        child.on('message', (m) => handleReporterMsg(m));
        child.on('exit', (childExit, signal) => {
            // die on first child exiting with non-null.
            if (childExit && childExit !== 0) {
                handleReporterMsg({
                    kind: 'run_complete',
                });
                process.exit(childExit);
            }
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
export const findPrefork = (testDir) => {
    const preforks = scanPrefork(testDir);
    return preforks.map((f) => path.join(testDir, f));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sYUFBYSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDL0MsT0FBTyxFQUFXLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRXRELE9BQU8sV0FBVyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sZUFBZSxNQUFNLDhCQUE4QixDQUFDO0FBQzNELE9BQU8sZ0JBQWdCLE1BQU0sK0JBQStCLENBQUM7QUFDN0QsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFdEMsTUFBTSxTQUFTLEdBQWdDO0lBQzNDLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLFFBQVEsRUFBRSxnQkFBZ0I7Q0FDN0IsQ0FBQztBQWFGLGtFQUFrRTtBQUNsRSxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFZLEVBQUUsTUFBd0IsRUFBRSxFQUFFO0lBQzlELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6RCxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV2QyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLGVBQWUsQ0FBQztJQUMvRCxNQUFNLE1BQU0sR0FBVyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxHQUFH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