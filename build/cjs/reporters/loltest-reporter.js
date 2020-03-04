"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorize_1 = require("../lib/colorize");
const pluralize_1 = require("../lib/pluralize");
const format_time_1 = require("../lib/format-time");
const formatError = (err) => {
    if (err.stack) {
        const c = err.stack.split('\n');
        const t = err.message;
        return [t, c[1]].join('\n');
    }
    else {
        return err.message;
    }
};
/** Don't print durations (in milliseconds) below this threshold. */
const SHOW_TIME_THRESHOLD_MS = 20;
const logSuccess = (title, fileName, duration) => `${colorize_1.green('✔︎')} ${fileName} ${colorize_1.dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS
    ? colorize_1.dim(` (${format_time_1.formatTime(duration)})`)
    : ''}`;
const logFail = (title, fileName, duration, error) => `${colorize_1.red('✗')} ${colorize_1.red(fileName)} ${colorize_1.dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS
    ? colorize_1.dim(` (${format_time_1.formatTime(duration)})`)
    : ''}
${error && formatError(error)}\n`;
/**
 * A plain reporter.
 *
 * Sample output:
 *
 ```bash
Found 4 tests in 2 files...
✗ test-file.ts › This fails
2 == 4
    at __1.test (/Users/brookie/Projects/Code/lookback/loltest/test/test-file.ts:9:12)
✗ test-file.ts: Deep equal
{ foo: 'bar' } deepEqual { bar: 'foo' }
    at __1.test (/Users/brookie/Projects/Code/lookback/loltest/test/test-file.ts:13:12)
✔︎ parse-args.ts › Parse args from an array
✔︎ parse-args.ts › Parse empty args array
✔︎ slow-test.ts › Before slow test
✔︎ slow-test.ts › After slow test
✔︎ test-file.ts › It works

Ran 29 tests in 3.01s
28 passed, 1 failed
```
 */
const LolTestReporter = {
    numFailedTests: 0,
    numPassedTests: 0,
    numTotalTests: 0,
    numFiles: 0,
    startTime: null,
    onCompileStart: (out) => out('Compiling…'),
    onCompileEnd: ({ numFiles, duration }, out) => out(`Compiled ${numFiles} ${pluralize_1.pluralize('file', numFiles)} in ${format_time_1.formatTime(duration)}`),
    onRunStart({ numFiles, maxChildCount }, out) {
        this.startTime = Date.now();
        this.numFiles = numFiles;
        out(`Using ${maxChildCount} children`);
        out(`Found ${numFiles} ${pluralize_1.pluralize('test file', numFiles)}…`);
    },
    onTestStart() {
        this.numTotalTests++;
    },
    onTestResult({ testCase, passed, error, duration }, out) {
        if (passed) {
            this.numPassedTests++;
        }
        else {
            this.numFailedTests++;
        }
        out(passed
            ? logSuccess(testCase.title, testCase.fileName, duration)
            : logFail(testCase.title, testCase.fileName, duration, error));
    },
    // "Ran X tests. Y passed, Z failed"
    onRunComplete(out) {
        const duration = this.startTime && Date.now() - this.startTime;
        out([
            `\n\nRan ${this.numTotalTests} ${pluralize_1.pluralize('test', this.numTotalTests)}${duration ? ` in ${format_time_1.formatTime(duration)}` : ''}`,
            `${this.numPassedTests
                ? colorize_1.green(this.numPassedTests + ' passed')
                : this.numPassedTests + ' passed'}, ${this.numFailedTests
                ? colorize_1.red(this.numFailedTests + ' failed')
                : this.numFailedTests + ' failed'}`,
        ].join('\n'));
    },
    onError: (error, out) => out(`⚠ ${colorize_1.yellow(error)}`),
};
exports.default = LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDhDQUEwRDtBQUMxRCxnREFBNkM7QUFDN0Msb0RBQWdEO0FBRWhELE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBNEIsRUFBVSxFQUFFO0lBQ3pELElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtRQUNYLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDdEIsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDL0I7U0FBTTtRQUNILE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztLQUN0QjtBQUNMLENBQUMsQ0FBQztBQUVGLG9FQUFvRTtBQUNwRSxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUVsQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsRUFBRSxDQUNyRSxHQUFHLGdCQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLGNBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzNDLFFBQVEsR0FBRyxzQkFBc0I7SUFDN0IsQ0FBQyxDQUFDLGNBQUcsQ0FBQyxLQUFLLHdCQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztJQUNuQyxDQUFDLENBQUMsRUFDVixFQUFFLENBQUM7QUFFUCxNQUFNLE9BQU8sR0FBRyxDQUNaLEtBQWEsRUFDYixRQUFnQixFQUNoQixRQUFnQixFQUNoQixLQUFhLEVBQ2YsRUFBRSxDQUNBLEdBQUcsY0FBRyxDQUFDLEdBQUcs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