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
const reporters = {
    tap: tap_reporter_1.default,
    loltest: loltest_reporter_1.default,
    loltest2: loltest2_reporter_1.default,
};
/** The main process which forks child processes for each test. */
exports.runMain = (self, config) => {
    const target = exports.findTarget(config.testDir, config.filter);
    const params = ['--child-runner', target,
        ...(config.testFilter ? ['--test-filter', config.testFilter] : [])];
    const reporter = reporters[config.reporter || 'loltest'];
    const child = child_process_1.default.fork(self, params, {
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
        const file = jsFiles.find(f => f.startsWith(filter));
        if (file) {
            return path_1.default.join(testDir, file);
        }
        else {
            console.error("No test file found for:", filter);
            process.exit(1);
        }
    }
    return testDir;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdEQUF3QjtBQUN4QixxQ0FBa0M7QUFHbEMsNEVBQW1EO0FBQ25ELG9GQUEyRDtBQUMzRCxzRkFBNkQ7QUFFN0QsTUFBTSxTQUFTLEdBQStCO0lBQzFDLEdBQUcsRUFBRSxzQkFBVztJQUNoQixPQUFPLEVBQUUsMEJBQWU7SUFDeEIsUUFBUSxFQUFFLDJCQUFnQjtDQUM3QixDQUFDO0FBU0Ysa0VBQWtFO0FBQ3JELFFBQUEsT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLE1BQXdCLEVBQUUsRUFBRTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELE1BQU0sTUFBTSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsTUFBTTtRQUNwQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXhFLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQyxDQUFDO0lBRXpELE1BQU0sS0FBSyxHQUFHLHVCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDM0MsNEVBQTRFO1FBQzVFLHNFQUFzRTtRQUN0RSxpRUFBaUU7UUFDakUsS0FBSyxFQUFFLENBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFFO0tBQ2xFLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FB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