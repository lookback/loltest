import { Reporter } from ".";
import { SerializedError } from "../lib/serialize-error";

enum Color {
    Green = "\x1b[32m",
    Red = "\x1b[31m",
    Reset = "\x1b[0m",
}

type ColorFn = (str: string) => string;

const colorize = (color: Color, str: string) => `${color}${str}${Color.Reset}`;

const red: ColorFn = colorize.bind(null, Color.Red);
const green: ColorFn = colorize.bind(null, Color.Green);

const formatError = (err: Error | SerializedError): string => {
    if (err.stack) {
        const c = err.stack.split('\n');
        const t = err.message;
        return [t, c[1]].join('\n');
    } else {
        return err.message;
    }
};

const logSuccess = (title: string, fileName: string) =>
    `${green("✔︎")} ${fileName}: ${title}`;

const logFail = (title: string, fileName: string, error?: Error) =>
    `${red("✗")} ${fileName}: ${title}\n${error && formatError(error)}`;

const pluralize = (noun: string, count: number) =>
    count > 1 ? `${noun}s` : noun;

/**
 * A plain reporter.
 *
 * Sample output:
 *
 ```bash
Found 4 tests in 2 files...
✗ test-file.ts: This fails
2 == 4
    at __1.test (/Users/brookie/Projects/Code/lookback/loltest/test/test-file.ts:9:12)
✗ test-file.ts: Deep equal
{ foo: 'bar' } deepEqual { bar: 'foo' }
    at __1.test (/Users/brookie/Projects/Code/lookback/loltest/test/test-file.ts:13:12)
✔︎ another-test.ts: Another
✔︎ test-file.ts: It works

Ran 4 tests – 2 passed, 2 failed
```
 */
const LolTestReporter: Reporter = {
    startRun: ({ total, numFiles }) =>
        `Found ${total} ${pluralize('test', total)} in ${numFiles} ${
            pluralize('file', numFiles)}...`,

    test: ({title, passed, fileName, error }) => {
        return passed
            ? logSuccess(title, fileName)
            : logFail(title, fileName, error);
    },

    // "Ran X tests. Y passed, Z failed"
    finishRun: ({ total, passed, failed }) => {
        return [
            `\nRan ${total} ${pluralize('test', total)} –`,
            `${passed ? green(passed + ' passed') : passed + ' passed'}, ${
                failed ? red(failed + ' failed') : failed + ' failed'}`,
        ].join(' ');
    },
};

export default LolTestReporter;
