"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = require("../lib/pluralize");
const format_time_1 = require("../lib/format-time");
const colorize_1 = require("../lib/colorize");
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
const badge = (color, text) => colorize_1.colorize({ back: color, front: colorize_1.FgColor.Black }, pad(text, 5));
/** Don't print durations (in milliseconds) below this threshold. */
const SHOW_TIME_THRESHOLD_MS = 20;
const time = (duration) => duration > SHOW_TIME_THRESHOLD_MS ? colorize_1.dim(` (${format_time_1.formatTime(duration)})`) : '';
const logSuccess = (title, fileName, duration) => `${badge(colorize_1.BgColor.Green, 'PASS')} ${colorize_1.colorize(colorize_1.Effect.Bold, fileName)} ${colorize_1.dim('›')} ${title}${time(duration)}`;
const logFail = (title, fileName, duration, error) => `${badge(colorize_1.BgColor.Red, 'FAIL')} ${colorize_1.colorize(colorize_1.Effect.Bold, fileName)} ${colorize_1.dim('›')} ${title}${time(duration)}`;
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
    onCompileEnd: ({ numFiles, duration }, out) => out(`Compiled ${numFiles} ${pluralize_1.pluralize('file', numFiles)} in ${format_time_1.formatTime(duration)}`),
    onRunStart({ numFiles, maxChildCount }, out) {
        this.startTime = Date.now();
        this.numFiles = numFiles;
        out(`Using ${maxChildCount} children`);
        out(`${colorize_1.colorize(colorize_1.Effect.Underline, `Found ${numFiles} ${pluralize_1.pluralize('test file', numFiles)}…\n`)}`);
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
                ? `${INDENT}${colorize_1.red(`${idx + 1}) ${testCase.fileName}`)} ${colorize_1.dim('›')} ${colorize_1.red(testCase.title)}${duration ? ` (${format_time_1.formatTime(duration)})` : ''}\n`
                : undefined,
            INDENT +
                (typeof error === 'string'
                    ? error
                    : formatError(error, 1)),
        ]
            .filter(Boolean)
            .join('\n'))
            .join('\n\n');
        out([
            fails.trim().length
                ? colorize_1.colorize(colorize_1.Effect.Underline, '\n\nSummary of all failed tests\n\n')
                : colorize_1.green('\n\n✔︎ All is fine!'),
            fails.trim().length ? fails : undefined,
            '\n',
            `${colorize_1.colorize(colorize_1.Effect.Bold, 'Files')}:\t\t${[
                this.failedFiles.size
                    ? colorize_1.red(`${this.failedFiles.size} failed`)
                    : undefined,
                this.passedFiles.size
                    ? colorize_1.green(`${this.passedFiles.size} passed`)
                    : `${this.passedFiles.size} passed`,
            ]
                .filter(Boolean)
                .join(', ')}, ${this.numFiles} total`,
            `${colorize_1.colorize(colorize_1.Effect.Bold, 'Tests')}:\t\t${[
                this.numFailedTests
                    ? colorize_1.red(`${this.numFailedTests} failed`)
                    : undefined,
                this.numPassedTests
                    ? colorize_1.green(`${this.numPassedTests} passed`)
                    : `${this.numPassedTests} passed`,
            ]
                .filter(Boolean)
                .join(', ')}, ${this.numTotalTests} total`,
            `${colorize_1.colorize(colorize_1.Effect.Bold, 'Duration')}:\t${duration ? format_time_1.formatTime(duration) : '-'}${duration
                ? ` (${this.numTotalTests > 0
                    ? format_time_1.formatTime(Number((duration / this.numTotalTests).toFixed(1)))
                    : '-'} avg)`
                : ''}`,
        ]
            .filter(Boolean)
            .join('\n'));
    },
    onError(error, out) {
        this.fails.push({
            error,
        });
        out(`${badge(colorize_1.BgColor.Yellow, 'ERR')} ${error}`);
    },
};
exports.default = LolTest2Reporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdDItcmVwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVwb3J0ZXJzL2xvbHRlc3QyLXJlcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsZ0RBQTZDO0FBQzdDLG9EQUFnRDtBQUNoRCw4Q0FReUI7QUFHekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBRXBCLG1GQUFtRjtBQUNuRixNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQVcsRUFBRSxHQUFXLEVBQVUsRUFBRSxDQUM3QyxHQUFHO0tBQ0UsSUFBSSxFQUFFO0tBQ04sTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUNYLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUV4QyxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQTRCLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBVSxFQUFFO0lBQ3JFLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtRQUNYLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPO2FBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUN2RDtTQUFNO1FBQ0gsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENB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