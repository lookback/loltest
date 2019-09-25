"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorize_1 = require("../lib/colorize");
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
const formatTime = (ms) => ms >= 1000 ? `${ms / 1E3}s` : `${ms}ms`;
const logSuccess = (title, fileName, duration) => `${colorize_1.green("✔︎")} ${fileName} ${colorize_1.dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS ? colorize_1.dim(` (${formatTime(duration)})`) : ''}`;
const logFail = (title, fileName, duration, error) => `${colorize_1.red("✗")} ${colorize_1.red(fileName)} ${colorize_1.dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS ? colorize_1.dim(` (${formatTime(duration)})`) : ''}
${error && formatError(error)}\n`;
const pluralize = (noun, count) => count > 1 ? `${noun}s` : noun;
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
    startRun: ({ total, numFiles }) => `Found ${total} ${pluralize('test', total)} in ${numFiles} ${pluralize('file', numFiles)}...`,
    test: ({ title, passed, fileName, error, duration }) => {
        return (passed
            ? logSuccess(title, fileName, duration)
            : logFail(title, fileName, duration, error));
    },
    // "Ran X tests. Y passed, Z failed"
    finishRun: ({ total, passed, failed, duration }) => {
        return [
            `\n\nRan ${total} ${pluralize('test', total)} in ${formatTime(duration)}`,
            `${passed ? colorize_1.green(passed + ' passed') : passed + ' passed'}, ${failed ? colorize_1.red(failed + ' failed') : failed + ' failed'}`,
        ].join('\n');
    },
    bail: (reason, error) => `⚠ ${colorize_1.yellow(reason)}` + (error
        ? `\n\n${formatError(error)}`
        : ''),
};
exports.default = LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDhDQUEwRDtBQUUxRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQTRCLEVBQVUsRUFBRTtJQUN6RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7UUFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9CO1NBQU07UUFDSCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDdEI7QUFDTCxDQUFDLENBQUM7QUFFRixvRUFBb0U7QUFDcEUsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFFbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUM5QixFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztBQUU1QyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsRUFBRSxDQUNyRSxHQUFHLGdCQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLGNBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzNDLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsY0FBRyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxF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