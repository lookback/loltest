import { green, red, dim, yellow } from '../lib/colorize';
import { pluralize } from '../lib/pluralize';
import { formatTime } from '../lib/format-time';
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
const logSuccess = (title, fileName, duration) => `${green('✔︎')} ${fileName} ${dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS
    ? dim(` (${formatTime(duration)})`)
    : ''}`;
const logFail = (title, fileName, duration, error) => `${red('✗')} ${red(fileName)} ${dim('›')} ${title}${duration > SHOW_TIME_THRESHOLD_MS
    ? dim(` (${formatTime(duration)})`)
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
    onCompileEnd: ({ numFiles, duration }, out) => out(`Compiled ${numFiles} ${pluralize('file', numFiles)} in ${formatTime(duration)}`),
    onRunStart: ({ total, numFiles }, out) => out(`Found ${total} ${pluralize('test', total)} in ${numFiles} ${pluralize('file', numFiles)}…`),
    onTestStart: (_, out) => out(),
    onTestResult: ({ testCase, passed, error, duration }, out) => out(passed
        ? logSuccess(testCase.title, testCase.fileName, duration)
        : logFail(testCase.title, testCase.fileName, duration, error)),
    // "Ran X tests. Y passed, Z failed"
    onRunComplete: ({ total, passed, failed, duration }, out) => out([
        `\n\nRan ${total} ${pluralize('test', total)} in ${formatTime(duration)}`,
        `${passed ? green(passed + ' passed') : passed + ' passed'}, ${failed ? red(failed + ' failed') : failed + ' failed'}`,
    ].join('\n')),
    onError: (reason, error, out) => out(`⚠ ${yellow(reason)}` + (error ? `\n\n${formatError(error)}` : '')),
};
export default LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVoRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQTRCLEVBQVUsRUFBRTtJQUN6RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7UUFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9CO1NBQU07UUFDSCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDdEI7QUFDTCxDQUFDLENBQUM7QUFFRixvRUFBb0U7QUFDcEUsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFFbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLEVBQUUsQ0FDckUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzNDLFFBQVEsR0FBRyxzQkFBc0I7SUFDN0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0lBQ25DLENBQUMsQ0FB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