"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const scan_1 = require("./lib/scan");
const child_1 = require("./child");
const tap_reporter_1 = __importDefault(require("./reporters/tap-reporter"));
const loltest_reporter_1 = __importDefault(require("./reporters/loltest-reporter"));
const loltest2_reporter_1 = __importDefault(require("./reporters/loltest2-reporter"));
const fs_1 = __importDefault(require("fs"));
const compile_1 = require("./compile");
const reporters = {
    tap: tap_reporter_1.default,
    loltest: loltest_reporter_1.default,
    loltest2: loltest2_reporter_1.default,
};
/** The main process which forks child processes for each test. */
exports.runMain = (self, config) => {
    const target = exports.findTarget(config.testDir, config.filter);
    const preforkFiles = exports.findPrefork(config.testDir);
    const testFiles = getTestFiles(target);
    const reporter = reporters[config.reporter] || loltest_reporter_1.default;
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
    compile_1.compileTs([...preforkFiles, ...testFiles], config, reporter, output);
    // files that are to be run before forking to child processes
    const preforks = preforkFiles
        .map((t) => t.replace(/\.(ts|js)$/, '.ts'))
        .map((t) => path_1.default.join(process.cwd(), t));
    child_1.registerShadowedTs(config.buildDir);
    // run them
    preforks.forEach((f) => require(f));
    const maxChildCount = config.maxChildCount;
    const todo = testFiles
        .map((t) => t.replace(/\.(ts|js)$/, '.ts'))
        .map((t) => path_1.default.join(process.cwd(), t));
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
        const child = child_process_1.default.fork(self, params, {
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
exports.findTarget = (testDir, filter) => {
    if (filter) {
        const jsFiles = scan_1.scan(testDir);
        const possible = jsFiles.filter((f) => f.startsWith(filter));
        possible.sort((f1, f2) => f1.length - f2.length);
        const file = possible[0]; // shortest wins
        if (file) {
            return path_1.default.join(testDir, file);
        }
        else {
            console.error('No test file found for:', filter);
            process.exit(1);
        }
    }
    return testDir;
};
exports.findPrefork = (testDir) => {
    const preforks = scan_1.scanPrefork(testDir);
    return preforks.map((f) => path_1.default.join(testDir, f));
};
const getTestFiles = (target) => {
    try {
        const stat = fs_1.default.statSync(target);
        if (stat.isFile()) {
            return [target];
        }
        else if (stat.isDirectory()) {
            return scan_1.scan(target).map((n) => path_1.default.join(target, n));
        }
        throw new Error('Neither file nor directory');
    }
    catch (err) {
        console.error(`Cannot find directory: ${target}`);
        return process.exit(1);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdEQUF3QjtBQUN4QixxQ0FBK0M7QUFDL0MsbUNBQXNEO0FBRXRELDRFQUFtRDtBQUNuRCxvRkFBMkQ7QUFDM0Qsc0ZBQTZEO0FBQzdELDRDQUFvQjtBQUNwQix1Q0FBc0M7QUFFdEMsTUFBTSxTQUFTLEdBQWdDO0lBQzNDLEdBQUcsRUFBRSxzQkFBVztJQUNoQixPQUFPLEVBQUUsMEJBQWU7SUFDeEIsUUFBUSxFQUFFLDJCQUFnQjtDQUM3QixDQUFDO0FBYUYsa0VBQWtFO0FBQ3JELFFBQUEsT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLE1BQXdCLEVBQUUsRUFBRTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELE1BQU0sWUFBWSxHQUFHLG1CQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV2QyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLDBCQUFlLENBQUM7SUFDL0QsTUFBTSxNQUFNLEdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRTVFLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDM0MsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2xCLEtBQUssV0FBVztnQkFDWixRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzdDLE9B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