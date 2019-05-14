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
    const params = ['--child-runner', target];
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
            console.error(reporter.bail(message.error && message.error.message));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdEQUF3QjtBQUN4QixxQ0FBa0M7QUFHbEMsNEVBQW1EO0FBQ25ELG9GQUEyRDtBQUUzRCxNQUFNLFNBQVMsR0FBK0I7SUFDMUMsR0FBRyxFQUFFLHNCQUFXO0lBQ2hCLE9BQU8sRUFBRSwwQkFBZTtDQUMzQixDQUFDO0FBUUYsa0VBQWtFO0FBQ3JELFFBQUEsT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLE1BQXdCLEVBQUUsRUFBRTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELE1BQU0sTUFBTSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFFMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztJQUVsRixJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUVELE1BQU0sS0FBSyxHQUFHLHVCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDM0MsNEVBQTRFO1FBQzVFLHNFQUFzRTtRQUN0RSxpRUFBaUU7UUFDakUsS0FBSyxFQUFFLENBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFFO0tBQ2xFLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBVSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRTtRQUN6Qix1QkFBdUI7UUFDdkIsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBRUYsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFFBQWtCLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO0lBQ2hFLFFBQVEsT0FBTyxDQUFDLElBQUksRUFBRTtRQUNsQixLQUFLLGNBQWM7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEQsT0FBTztRQUNYLEtBQUssYUFBYTtZQUNkLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLE9BQU87UUFDWCxLQUFLLGVBQWU7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE9BQU87UUFDWCxLQUFLLG9CQUFvQjtZQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckUsT0FBTztLQUNkO0lBQ0QsQ0FBQyxDQUFDLENBQVEsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxvQkFBb0I7QUFDdEQsQ0FBQyxDQUFDO0FBRUYsaURBQWlEO0FBQ3BDLFFBQUEsVUFBVSxHQUFHLENBQUMsT0FBZSxFQUFFLE1BQWUsRUFBVSxFQUFFO0lBQ25FLElBQUksTUFBTSxFQUFFO1FBQ1IsTUFBTSxPQUFPLEdBQUcsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxJQUFJLEVBQUU7WUFDTixPQUFPLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ25DO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7S0FDSjtJQUVELE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUMsQ0FBQyJ9