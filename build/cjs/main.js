"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const scan_1 = require("./lib/scan");
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
    const testFiles = getTestFiles(target);
    const reporter = reporters[config.reporter || 'loltest'];
    // compile ts to be reused by each child.
    compile_1.compileTs(testFiles, config);
    const maxChildCount = config.maxChildCount;
    const todo = testFiles
        .map((t) => t.replace(/\.(ts|js)$/, '.ts'))
        .map((t) => path_1.default.join(process.cwd(), t));
    // tslint:disable-next-line:no-let
    let running = 0;
    const runNext = () => {
        if (running >= maxChildCount || !todo.length) {
            return false;
        }
        running++;
        const next = todo.shift();
        const params = ['--child-runner', next, '--build-dir', config.buildDir];
        const child = child_process_1.default.fork(self, params, {
            // See https://nodejs.org/api/child_process.html#child_process_options_stdio
            // We pipe stdin, stdout, stderr between the parent and child process,
            // and enable IPC (Inter Process Communication) to pass messages.
            stdio: [process.stdin, process.stdout, process.stderr, 'ipc'],
        });
        child.on('message', (m) => handleChildMessage(reporter, m));
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
    while (runNext()) { }
};
const handleChildMessage = (reporter, message) => {
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
    ((x) => { })(message); // assert exhaustive
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdEQUF3QjtBQUN4QixxQ0FBa0M7QUFHbEMsNEVBQW1EO0FBQ25ELG9GQUEyRDtBQUMzRCxzRkFBNkQ7QUFDN0QsNENBQW9CO0FBQ3BCLHVDQUFzQztBQUV0QyxNQUFNLFNBQVMsR0FBZ0M7SUFDM0MsR0FBRyxFQUFFLHNCQUFXO0lBQ2hCLE9BQU8sRUFBRSwwQkFBZTtJQUN4QixRQUFRLEVBQUUsMkJBQWdCO0NBQzdCLENBQUM7QUFXRixrRUFBa0U7QUFDckQsUUFBQSxPQUFPLEdBQUcsQ0FBQyxJQUFZLEVBQUUsTUFBd0IsRUFBRSxFQUFFO0lBQzlELE1BQU0sTUFBTSxHQUFHLGtCQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekQsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXZDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDO0lBRXpELHlDQUF5QztJQUN6QyxtQkFBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUU3QixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQzNDLE1BQU0sSUFBSSxHQUFHLFNBQVM7U0FDakIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMxQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0Msa0NBQWtDO0lBQ2xDLElBQUks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