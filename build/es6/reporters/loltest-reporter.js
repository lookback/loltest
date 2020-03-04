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
    numFailedTests: 0,
    numPassedTests: 0,
    numTotalTests: 0,
    numFiles: 0,
    startTime: null,
    onCompileStart: (out) => out('Compiling…'),
    onCompileEnd: ({ numFiles, duration }, out) => out(`Compiled ${numFiles} ${pluralize('file', numFiles)} in ${formatTime(duration)}`),
    onRunStart({ numFiles, maxChildCount }, out) {
        this.startTime = Date.now();
        this.numFiles = numFiles;
        out(`Using ${maxChildCount} children`);
        out(`Found ${numFiles} ${pluralize('test file', numFiles)}…`);
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
            `\n\nRan ${this.numTotalTests} ${pluralize('test', this.numTotalTests)}${duration ? ` in ${formatTime(duration)}` : ''}`,
            `${this.numPassedTests
                ? green(this.numPassedTests + ' passed')
                : this.numPassedTests + ' passed'}, ${this.numFailedTests
                ? red(this.numFailedTests + ' failed')
                : this.numFailedTests + ' failed'}`,
        ].join('\n'));
    },
    onError: (error, out) => out(`⚠ ${yellow(error)}`),
};
export default LolTestReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdC1yZXBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvcnRlcnMvbG9sdGVzdC1yZXBvcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVoRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQTRCLEVBQVUsRUFBRTtJQUN6RCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7UUFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9CO1NBQU07UUFDSCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDdEI7QUFDTCxDQUFDLENBQUM7QUFFRixvRUFBb0U7QUFDcEUsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFFbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLEVBQUUsQ0FDckUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQzNDLFFBQVEsR0FBRyxzQkFBc0I7SUFDN0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0lBQ25DLENBQUMsQ0FB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