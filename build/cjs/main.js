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
const reporters = {
    tap: tap_reporter_1.default,
    loltest: loltest_reporter_1.default,
};
/** The main process which forks child processes for each test. */
exports.runMain = (self, config) => {
    const target = exports.findTarget(config.testDir, config.filter);
    const params = ['--child-runner', target,
        ...(config.testFilter ? ['--test-filter', config.testFilter] : [])];
    const reporter = config.reporter ? reporters[config.reporter] : reporters.loltest;
    if (!reporter) {
        console.error('Unknown reporter:', config.reporter);
        process.exit(1);
    }
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
            console.error(reporter.bail(message.reason, message.error));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdEQUF3QjtBQUN4QixxQ0FBa0M7QUFHbEMsNEVBQW1EO0FBQ25ELG9GQUEyRDtBQUUzRCxNQUFNLFNBQVMsR0FBK0I7SUFDMUMsR0FBRyxFQUFFLHNCQUFXO0lBQ2hCLE9BQU8sRUFBRSwwQkFBZTtDQUMzQixDQUFDO0FBU0Ysa0VBQWtFO0FBQ3JELFFBQUEsT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLE1BQXdCLEVBQUUsRUFBRTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELE1BQU0sTUFBTSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsTUFBTTtRQUNwQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXhFLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7SUFFbEYsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFFRCxNQUFNLEtBQUssR0FBRyx1QkFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1FBQzNDLDRFQUE0RTtRQUM1RSxzRUFBc0U7UUFDdEUsaUVBQWlFO1FB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