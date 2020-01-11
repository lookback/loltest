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
    .padStart(len + str.length / 2);
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
const badge = (color, text) => colorize_1.colorize({ back: color, front: colorize_1.FgColor.Black }, pad(text, 6));
/** Don't print durations (in milliseconds) below this threshold. */
const SHOW_TIME_THRESHOLD_MS = 20;
const time = (duration) => duration > SHOW_TIME_THRESHOLD_MS ? colorize_1.dim(` (${format_time_1.formatTime(duration)})`) : '';
const logSuccess = (title, fileName, duration) => `${badge(colorize_1.BgColor.Green, 'PASS')} ${colorize_1.colorize(colorize_1.Effect.Bold, fileName)} ${colorize_1.dim('›')} ${title}${time(duration)}`;
const logFail = (title, fileName, duration, error) => `${badge(colorize_1.BgColor.Red, 'FAIL')} ${colorize_1.colorize(colorize_1.Effect.Bold, fileName)} ${colorize_1.dim('›')} ${title}${time(duration)}`;
const LolTest2Reporter = {
    fails: [],
    failedFiles: new Set(),
    passedFiles: new Set(),
    onCompileStart: (out) => out('Compiling…'),
    onCompileEnd: ({ numFiles, duration }, out) => out(`Compiled ${numFiles} ${pluralize_1.pluralize('file', numFiles)} in ${format_time_1.formatTime(duration)}`),
    onRunStart: ({ total, numFiles }, out) => out(`${colorize_1.colorize(colorize_1.Effect.Underline, `Running ${total} ${pluralize_1.pluralize('test', total)} in ${numFiles} ${pluralize_1.pluralize('file', numFiles)}…\n`)}`),
    onTestStart: (testCase, out) => out(),
    // `${colorize(
    //     { back: BgColor.Yellow, front: FgColor.Black },
    //     " START "
    // )} ${testCase.fileName} ${dim("›")} ${testCase.title}`,
    onTestResult(report, out) {
        const { testCase, passed, error, duration } = report;
        if (!passed) {
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
    onRunComplete({ total, passed, failed, duration, numFiles }, out) {
        const fails = this.fails
            .map(({ testCase, error, duration }, idx) => [
            testCase
                ? `${INDENT}${colorize_1.red(`${idx + 1}) ${testCase.fileName}`)} ${colorize_1.dim('›')} ${colorize_1.red(testCase.title)}${duration ? ` (${format_time_1.formatTime(duration)})` : ''}\n`
                : undefined,
            INDENT + formatError(error, 1),
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
                .join(', ')}, ${numFiles} total`,
            `${colorize_1.colorize(colorize_1.Effect.Bold, 'Tests')}:\t\t${[
                failed ? colorize_1.red(`${failed} failed`) : undefined,
                passed ? colorize_1.green(`${passed} passed`) : `${passed} passed`,
            ]
                .filter(Boolean)
                .join(', ')}, ${total} total`,
            `${colorize_1.colorize(colorize_1.Effect.Bold, 'Duration')}:\t${format_time_1.formatTime(duration)} (${format_time_1.formatTime(Number((duration / total).toFixed(1)))} avg)`,
        ]
            .filter(Boolean)
            .join('\n'));
    },
    onError(reason, error, out) {
        this.fails.push({
            error: error || new Error('Unknown error'),
        });
        out(`${badge(colorize_1.BgColor.Yellow, 'ERR')} ${reason}`);
    },
};
exports.default = LolTest2Reporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdDItcmVwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVwb3J0ZXJzL2xvbHRlc3QyLXJlcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsZ0RBQTZDO0FBQzdDLG9EQUFnRDtBQUNoRCw4Q0FReUI7QUFHekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBRXBCLG1GQUFtRjtBQUNuRixNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQVcsRUFBRSxHQUFXLEVBQVUsRUFBRSxDQUM3QyxHQUFHO0tBQ0UsSUFBSSxFQUFFO0tBQ04sTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUNYLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUV4QyxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQTRCLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBVSxFQUFFO0lBQ3JFLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtRQUNYLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPO2FBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUN2RDtTQUFNO1FBQ0gsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENB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