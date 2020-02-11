import { pluralize } from '../lib/pluralize';
import { formatTime } from '../lib/format-time';
import { BgColor, FgColor, green, red, dim, colorize, Effect, } from '../lib/colorize';
const INDENT = '  ';
/** Pad trail and beginning of string with whitespace to a desired total length. */
const pad = (str, len) => str
    .trim()
    .padEnd(len)
    .padStart(len * 2 - str.length);
const formatError = (err, indent = 0) => {
    if (err.stack) {
        const c = err.stack.split('\n');
        const t = err.message
            .split('\n')
            .join('\n' + INDENT.repeat(indent + 1));
        return [t, c[1]].join('\n' + INDENT.repeat(indent));
    }
    else {
        return err.message.split('\n').join('\n' + INDENT.repeat(indent + 1));
    }
};
const badge = (color, text) => colorize({ back: color, front: FgColor.Black }, pad(text, 5));
/** Don't print durations (in milliseconds) below this threshold. */
const SHOW_TIME_THRESHOLD_MS = 20;
const time = (duration) => duration > SHOW_TIME_THRESHOLD_MS ? dim(` (${formatTime(duration)})`) : '';
const logSuccess = (title, fileName, duration) => `${badge(BgColor.Green, 'PASS')} ${colorize(Effect.Bold, fileName)} ${dim('›')} ${title}${time(duration)}`;
const logFail = (title, fileName, duration, error) => `${badge(BgColor.Red, 'FAIL')} ${colorize(Effect.Bold, fileName)} ${dim('›')} ${title}${time(duration)}`;
const LolTest2Reporter = {
    fails: [],
    failedFiles: new Set(),
    passedFiles: new Set(),
    numFailedTests: 0,
    numPassedTests: 0,
    numTotalTests: 0,
    numFiles: 0,
    startTime: null,
    onCompileStart: (out) => out('Compiling…'),
    onCompileEnd: ({ numFiles, duration }, out) => out(`Compiled ${numFiles} ${pluralize('file', numFiles)} in ${formatTime(duration)}`),
    onRunStart({ numFiles }, out) {
        this.startTime = Date.now();
        this.numFiles = numFiles;
        out(`${colorize(Effect.Underline, `Found ${numFiles} ${pluralize('test file', numFiles)}…\n`)}`);
    },
    onTestStart() {
        this.numTotalTests++;
    },
    onTestResult(report, out) {
        const { testCase, passed, error, duration } = report;
        if (passed) {
            this.numPassedTests++;
        }
        if (!passed) {
            this.numFailedTests++;
            this.fails.push({
                testCase,
                error: error || new Error('Unknown fail'),
                duration,
            });
            this.failedFiles.add(testCase.fileName);
            this.passedFiles.delete(testCase.fileName);
        }
        else if (!this.failedFiles.has(testCase.fileName)) {
            this.passedFiles.add(testCase.fileName);
        }
        out(passed
            ? logSuccess(testCase.title, testCase.fileName, duration)
            : logFail(testCase.title, testCase.fileName, duration, error));
    },
    // "Ran X tests. Y passed, Z failed"
    onRunComplete(out) {
        const duration = this.startTime && Date.now() - this.startTime;
        const fails = this.fails
            .map(({ testCase, error, duration }, idx) => [
            testCase
                ? `${INDENT}${red(`${idx + 1}) ${testCase.fileName}`)} ${dim('›')} ${red(testCase.title)}${duration ? ` (${formatTime(duration)})` : ''}\n`
                : undefined,
            INDENT + (typeof error === 'string'
                ? error
                : formatError(error, 1)),
        ]
            .filter(Boolean)
            .join('\n'))
            .join('\n\n');
        out([
            fails.trim().length
                ? colorize(Effect.Underline, '\n\nSummary of all failed tests\n\n')
                : green('\n\n✔︎ All is fine!'),
            fails.trim().length ? fails : undefined,
            '\n',
            `${colorize(Effect.Bold, 'Files')}:\t\t${[
                this.failedFiles.size
                    ? red(`${this.failedFiles.size} failed`)
                    : undefined,
                this.passedFiles.size
                    ? green(`${this.passedFiles.size} passed`)
                    : `${this.passedFiles.size} passed`,
            ]
                .filter(Boolean)
                .join(', ')}, ${this.numFiles} total`,
            `${colorize(Effect.Bold, 'Tests')}:\t\t${[
                this.numFailedTests ? red(`${this.numFailedTests} failed`) : undefined,
                this.numPassedTests ? green(`${this.numPassedTests} passed`) : `${this.numPassedTests} passed`,
            ]
                .filter(Boolean)
                .join(', ')}, ${this.numTotalTests} total`,
            `${colorize(Effect.Bold, 'Duration')}:\t${duration ? formatTime(duration) : '-'}${duration ? ` (${this.numTotalTests > 0
                ? formatTime(Number((duration / this.numTotalTests).toFixed(1)))
                : '-'} avg)` : ''}`,
        ]
            .filter(Boolean)
            .join('\n'));
    },
    onError(error, out) {
        this.fails.push({
            error,
        });
        out(`${badge(BgColor.Yellow, 'ERR')} ${error}`);
    },
};
export default LolTest2Reporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdDItcmVwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVwb3J0ZXJzL2xvbHRlc3QyLXJlcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUNILE9BQU8sRUFDUCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEdBQUcsRUFDSCxHQUFHLEVBQ0gsUUFBUSxFQUNSLE1BQU0sR0FDVCxNQUFNLGlCQUFpQixDQUFDO0FBR3pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQztBQUVwQixtRkFBbUY7QUFDbkYsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFXLEVBQUUsR0FBVyxFQUFVLEVBQUUsQ0FDN0MsR0FBRztLQUNFLElBQUksRUFBRTtLQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDWCxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFeEMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUE0QixFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQVUsRUFBRTtJQUNyRSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7UUFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTzthQUNoQixLQUFLLENBQUMsSUFBSSxDQUFDO2FBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUks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