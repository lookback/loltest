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
const logSuccess = (title, fileName, duration) => `${colorize_1.green("✔︎")} ${fileName} ${colorize_1.dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS ? colorize_1.dim(` (${format_time_1.formatTime(duration)})`) : ''}`;
const logFail = (title, fileName, duration, error) => `${colorize_1.red("✗")} ${colorize_1.red(fileName)} ${colorize_1.dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS ? colorize_1.dim(` (${format_time_1.formatTime(duration)})`) : ''}
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
    onRunStart: ({ total, numFiles }) => `Found ${total} ${pluralize_1.pluralize('test', total)} in ${numFiles} ${pluralize_1.pluralize('file', numFiles)}...`,
    onTestStart: () => {
        return undefined;
    },
    onTestResult: ({ testCase, passed, error, duration }) => {
        return (passed
            ? logSuccess(testCase.title, testCase.fileName, duration)
            : logFail(testCase.title, testCase.fileName, duration, error));
    },
    // "Ran X tests. Y passed, Z failed"
    onRunComplete: ({ total, passed, failed, duration }) => {
        return [
            `\n\nRan ${total} ${pluralize_1.pluralize('test', total)} in ${format_time_1.formatTime(duration)}`,
            `${passed ? colorize_1.green(passed + ' passed') : passed + ' passed'}, ${failed ? colorize_1.red(failed + ' failed') : failed + ' failed'}`,
        ].join('\n');
    },
    onError: (reason, error) => `⚠ ${colorize_1.yellow(reason)}` + (error
        ? `\n\n${formatError(error)}`
        : ''),
};
exports.default = LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDhDQUEwRDtBQUMxRCxnREFBNkM7QUFDN0Msb0RBQWdEO0FBRWhELE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBNEIsRUFBVSxFQUFFO0lBQ3pELElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtRQUNYLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDdEIsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDL0I7U0FBTTtRQUNILE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztLQUN0QjtBQUNMLENBQUMsQ0FBQztBQUVGLG9FQUFvRTtBQUNwRSxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUVsQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsRUFBRSxDQUNyRSxHQUFHLGdCQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLGNBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzNDLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsY0FBRyxDQUFDLEtBQUssd0JBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBRXJGLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBYSxFQUFFLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxLQUFhLEVBQUUsRUFBRSxDQUNqRixHQUFHLGNBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxjQUFHLENBQUMsUUFBUSxDQUFDLElBQUksY0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FDN0MsUUFBUSxHQUFHLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxjQUFHLENBQUMsS0FBSyx3QkFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtFQUNoRixLQUFLLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFFbEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSCxNQUFNLGVBQWUsR0FBYTtJQUM5QixVQUFVLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQ2hDLFNBQVMsS0FBSyxJQUFJLHFCQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLFFBQVEsSUFDckQscUJBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEtBQUs7SUFFeEMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUNkLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxZQUFZLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7UUFDbkQsT0FBTyxDQUFDLE1BQU07WUFDVixDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7WUFDekQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7UUFDbkQsT0FBTztZQUNILFdBQVcsS0FBSyxJQUFJLHFCQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLHdCQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDekUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxLQUN0RCxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxTQUFTLEVBQUU7U0FDOUQsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUN2QixLQUFLLGlCQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUs7UUFDMUIsQ0FBQyxDQUFDLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQzdCLENBQUMsQ0FBQyxFQUFFLENBQUM7Q0FDaEIsQ0FBQztBQUVGLGtCQUFlLGVBQWUsQ0FBQyJ9