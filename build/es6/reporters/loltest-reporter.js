import { green, red, dim, yellow } from "../lib/colorize";
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
const logSuccess = (title, fileName, duration) => `${green("✔︎")} ${fileName} ${dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS ? dim(` (${formatTime(duration)})`) : ''}`;
const logFail = (title, fileName, duration, error) => `${red("✗")} ${red(fileName)} ${dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS ? dim(` (${formatTime(duration)})`) : ''}
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
            `${passed ? green(passed + ' passed') : passed + ' passed'}, ${failed ? red(failed + ' failed') : failed + ' failed'}`,
        ].join('\n');
    },
    bail: (reason, error) => `⚠ ${yellow(reason)}` + (error
        ? `\n\n${formatError(error)}`
        : ''),
};
export default LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFMUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUE0QixFQUFVLEVBQUU7SUFDekQsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO1FBQ1gsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUN0QixPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQjtTQUFNO1FBQ0gsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDO0tBQ3RCO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsb0VBQW9FO0FBQ3BFLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBRWxDLE1BQU0sVUFBVSxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FDOUIsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7QUFFNUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLEVBQUUsQ0FDckUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzNDLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFD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