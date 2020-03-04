// tslint:disable no-object-mutation
import { Reporter } from '.';
import { SerializedError } from '../lib/serialize-error';
import { green, red, dim, yellow } from '../lib/colorize';
import { pluralize } from '../lib/pluralize';
import { formatTime } from '../lib/format-time';

const formatError = (err: Error | SerializedError): string => {
    if (err.stack) {
        const c = err.stack.split('\n');
        const t = err.message;
        return [t, c[1]].join('\n');
    } else {
        return err.message;
    }
};

/** Don't print durations (in milliseconds) below this threshold. */
const SHOW_TIME_THRESHOLD_MS = 20;

const logSuccess = (title: string, fileName: string, duration: number) =>
    `${green('✔︎')} ${fileName} ${dim('›')} ${title}${
        duration > SHOW_TIME_THRESHOLD_MS
            ? dim(` (${formatTime(duration)})`)
            : ''
    }`;

const logFail = (
    title: string,
    fileName: string,
    duration: number,
    error?: Error
) =>
    `${red('✗')} ${red(fileName)} ${dim('›')} ${title}${
        duration > SHOW_TIME_THRESHOLD_MS
            ? dim(` (${formatTime(duration)})`)
            : ''
    }
${error && formatError(error)}\n`;

interface LolTestReporter extends Reporter {
    numPassedTests: number;
    numFailedTests: number;
    numTotalTests: number;
    numFiles: number;

    startTime: number | null; // in ms
}

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
const LolTestReporter: LolTestReporter = {
    numFailedTests: 0,
    numPassedTests: 0,
    numTotalTests: 0,
    numFiles: 0,

    startTime: null,

    onCompileStart: (out) => out('Compiling…'),

    onCompileEnd: ({ numFiles, duration }, out) =>
        out(
            `Compiled ${numFiles} ${pluralize(
                'file',
                numFiles
            )} in ${formatTime(duration)}`
        ),

    onRunStart({ numFiles, maxChildCount }, out): void {
        this.startTime = Date.now();
        this.numFiles = numFiles;

        out(`Using ${maxChildCount} children`);
        out(`Found ${numFiles} ${pluralize('test file', numFiles)}…`);
    },

    onTestStart(): void {
        this.numTotalTests++;
    },

    onTestResult({ testCase, passed, error, duration }, out): void {
        if (passed) {
            this.numPassedTests++;
        } else {
            this.numFailedTests++;
        }

        out(
            passed
                ? logSuccess(testCase.title, testCase.fileName, duration)
                : logFail(testCase.title, testCase.fileName, duration, error)
        );
    },

    // "Ran X tests. Y passed, Z failed"
    onRunComplete(out): void {
        const duration = this.startTime && Date.now() - this.startTime;

        out(
            [
                `\n\nRan ${this.numTotalTests} ${pluralize('test', this.numTotalTests)}${duration ? ` in ${formatTime(
                    duration
                )}` : ''}`,
                `${this.numPassedTests ? green(this.numPassedTests + ' passed') : this.numPassedTests + ' passed'}, ${
                    this.numFailedTests ? red(this.numFailedTests + ' failed') : this.numFailedTests + ' failed'
                }`,
            ].join('\n')
        );
    },

    onError: (error, out) =>
        out(`⚠ ${yellow(error)}`),
};

export default LolTestReporter;
