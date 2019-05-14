import { green, red, dim } from "../lib/colorize";
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
    bail: (reason) => `${red('An error occurred!')}\n${reason}`,
};
export default LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVsRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQTRCLEVBQVUsRUFBRTtJQUN6RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7UUFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9CO1NBQU07UUFDSCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDdEI7QUFDTCxDQUFDLENBQUM7QUFFRixvRUFBb0U7QUFDcEUsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFFbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUM5QixFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztBQUU1QyxNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsRUFBRSxDQUNyRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FDM0MsUUFBUSxHQUFHLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUVyRixNQUFNLE9BQU8sR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFLFFBQWdCLEVBQUUsS0FBYSxFQUFFLEVBQUUsQ0FDakYsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzdDLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtFQUNoRixLQUFLLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFFbEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLEVBQUUsQ0FDOUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRWxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0gsTUFBTSxlQUFlLEdBQWE7SUFDOUIsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUM5QixTQUFTLEtBQUssSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLFFBQVEsSUFDckQsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSztJQUV4QyxJQUFJLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1FBQ2xELE9BQU8sQ0FBQyxNQUFNO1lBQ1YsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztZQUN2QyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7UUFDL0MsT0FBTztZQUNILFdBQVcsS0FBSyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3pFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxLQUN0RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxTQUFTLEVBQUU7U0FDOUQsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ2IsR0FBRyxHQUFHLENBQUMsb0JBQW9CLENBQUMsS0FBSyxNQUFNLEVBQUU7Q0FDaEQsQ0FBQztBQUVGLGVBQWUsZUFBZSxDQUFDIn0=