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
const LolTestReporter: Reporter = {
    onRunStart: ({ total, numFiles }, out) =>
        out(
            `Found ${total} ${pluralize(
                'test',
                total
            )} in ${numFiles} ${pluralize('file', numFiles)}...`
        ),

    onTestStart: (_, out) => out(),

    onTestResult: ({ testCase, passed, error, duration }, out) =>
        out(
            passed
                ? logSuccess(testCase.title, testCase.fileName, duration)
                : logFail(testCase.title, testCase.fileName, duration, error)
        ),

    // "Ran X tests. Y passed, Z failed"
    onRunComplete: ({ total, passed, failed, duration }, out) =>
        out(
            [
                `\n\nRan ${total} ${pluralize('test', total)} in ${formatTime(
                    duration
                )}`,
                `${passed ? green(passed + ' passed') : passed + ' passed'}, ${
                    failed ? red(failed + ' failed') : failed + ' failed'
                }`,
            ].join('\n')
        ),

    onError: (reason, error, out) =>
        out(`⚠ ${yellow(reason)}` + (error ? `\n\n${formatError(error)}` : '')),
};

export default LolTestReporter;
