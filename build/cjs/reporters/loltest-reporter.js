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
    onCompileStart: (out) => out('Compiling…'),
    onCompileEnd: ({ numFiles, duration }, out) => out(`Compiled ${numFiles} ${pluralize_1.pluralize('file', numFiles)} in ${format_time_1.formatTime(duration)}`),
    onRunStart: ({ total, numFiles }, out) => out(`Found ${total} ${pluralize_1.pluralize('test', total)} in ${numFiles} ${pluralize_1.pluralize('file', numFiles)}…`),
    onTestStart: (_, out) => out(),
    onTestResult: ({ testCase, passed, error, duration }, out) => out(passed
        ? logSuccess(testCase.title, testCase.fileName, duration)
        : logFail(testCase.title, testCase.fileName, duration, error)),
    // "Ran X tests. Y passed, Z failed"
    onRunComplete: ({ total, passed, failed, duration }, out) => out([
        `\n\nRan ${total} ${pluralize_1.pluralize('test', total)} in ${format_time_1.formatTime(duration)}`,
        `${passed ? colorize_1.green(passed + ' passed') : passed + ' passed'}, ${failed ? colorize_1.red(failed + ' failed') : failed + ' failed'}`,
    ].join('\n')),
    onError: (reason, error, out) => out(`⚠ ${colorize_1.yellow(reason)}` + (error ? `\n\n${formatError(error)}` : '')),
};
exports.default = LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDhDQUEwRDtBQUMxRCxnREFBNkM7QUFDN0Msb0RBQWdEO0FBRWhELE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBNEIsRUFBVSxFQUFFO0lBQ3pELElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtRQUNYLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDdEIsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDL0I7U0FBTTtRQUNILE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztLQUN0QjtBQUNMLENBQUMsQ0FBQztBQUVGLG9FQUFvRTtBQUNwRSxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUVsQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsRUFBRSxDQUNyRSxHQUFHLGdCQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLGNBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzNDLFFBQVEsR0FBRyxzQkFBc0I7SUFDN0IsQ0FBQyxDQUFDLGNBQUcsQ0FBQyxLQUFLLHdCQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztJQUNuQyxDQUFDLENBQUMsRUFDVixFQUFFLENBQUM7QUFFUCxNQUFNLE9BQU8sR0FBRyxDQUNaLEtBQWEsRUFDYixRQUFnQixFQUNoQixRQUFnQixFQUNoQixLQUFhLEVBQ2YsRUFBRSxDQUNBLEdBQUcsY0FBRyxDQUFDLEdBQUcs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