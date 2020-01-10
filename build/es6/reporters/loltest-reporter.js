import { green, red, dim, yellow } from "../lib/colorize";
import { pluralize } from "../lib/pluralize";
import { formatTime } from "../lib/format-time";
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
const logSuccess = (title, fileName, duration) => `${green("✔︎")} ${fileName} ${dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS ? dim(` (${formatTime(duration)})`) : ''}`;
const logFail = (title, fileName, duration, error) => `${red("✗")} ${red(fileName)} ${dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS ? dim(` (${formatTime(duration)})`) : ''}
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
    onRunStart: ({ total, numFiles }) => `Found ${total} ${pluralize('test', total)} in ${numFiles} ${pluralize('file', numFiles)}...`,
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
            `\n\nRan ${total} ${pluralize('test', total)} in ${formatTime(duration)}`,
            `${passed ? green(passed + ' passed') : passed + ' passed'}, ${failed ? red(failed + ' failed') : failed + ' failed'}`,
        ].join('\n');
    },
    onError: (reason, error) => `⚠ ${yellow(reason)}` + (error
        ? `\n\n${formatError(error)}`
        : ''),
};
export default LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVoRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQTRCLEVBQVUsRUFBRTtJQUN6RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7UUFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9CO1NBQU07UUFDSCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDdEI7QUFDTCxDQUFDLENBQUM7QUFFRixvRUFBb0U7QUFDcEUsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFFbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLEVBQUUsQ0FDckUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzNDLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFFckYsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLEtBQWEsRUFBRSxFQUFFLENBQ2pGLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxHQUM3QyxRQUFRLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7RUFDaEYsS0FBSyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBRWxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0gsTUFBTSxlQUFlLEdBQWE7SUFDOUIsVUFBVSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUNoQyxTQUFTLEtBQUssSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLFFBQVEsSUFDckQsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSztJQUV4QyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ2QsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELFlBQVksRUFBRSxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtRQUNuRCxPQUFPLENBQUMsTUFBTTtZQUNWLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztZQUN6RCxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsb0NBQW9DO0lBQ3BDLGFBQWEsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtRQUNuRCxPQUFPO1lBQ0gsV0FBVyxLQUFLLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDekUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxTQUFTLEtBQ3RELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtTQUM5RCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRUQsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ3ZCLEtBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLO1FBQzFCLENBQUMsQ0FBQyxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QixDQUFDLENBQUMsRUFBRSxDQUFDO0NBQ2hCLENBQUM7QUFFRixlQUFlLGVBQWUsQ0FBQyJ9