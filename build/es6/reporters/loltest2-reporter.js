import { pluralize } from "../lib/pluralize";
import { formatTime } from "../lib/format-time";
import { BgColor, FgColor, green, red, dim, colorize, Effect } from "../lib/colorize";
const INDENT = '  ';
/** Pad trail and beginning of string with whitespace to a desired total length. */
const pad = (str, len) => str.trim().padEnd(len).padStart(len + (str.length / 2));
const formatError = (err, indent = 0) => {
    if (err.stack) {
        const c = err.stack.split('\n');
        const t = err.message.split('\n').join('\n' + INDENT.repeat(indent + 1));
        return [t, c[1]].join('\n' + INDENT.repeat(indent));
    }
    else {
        return err.message.split('\n').join('\n' + INDENT.repeat(indent + 1));
    }
};
const badge = (color, text) => colorize({ back: color, front: FgColor.Black }, pad(text, 6));
/** Don't print durations (in milliseconds) below this threshold. */
const SHOW_TIME_THRESHOLD_MS = 20;
const time = (duration) => duration > SHOW_TIME_THRESHOLD_MS
    ? dim(` (${formatTime(duration)})`)
    : "";
const logSuccess = (title, fileName, duration) => `${badge(BgColor.Green, "PASS")} ${colorize(Effect.Bold, fileName)} ${dim("›")} ${title}${time(duration)}`;
const logFail = (title, fileName, duration, error) => `${badge(BgColor.Red, "FAIL")} ${colorize(Effect.Bold, fileName)} ${dim("›")} ${title}${time(duration)}`;
const LolTest2Reporter = {
    fails: [],
    failedFiles: new Set(),
    passedFiles: new Set(),
    onRunStart: ({ total, numFiles }) => `${colorize(Effect.Underline, `Running ${total} ${pluralize("test", total)} in ${numFiles} ${pluralize("file", numFiles)}...\n`)}`,
    onTestStart: testCase => undefined,
    // `${colorize(
    //     { back: BgColor.Yellow, front: FgColor.Black },
    //     " START "
    // )} ${testCase.fileName} ${dim("›")} ${testCase.title}`,
    onTestResult(report) {
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
        return passed
            ? logSuccess(testCase.title, testCase.fileName, duration)
            : logFail(testCase.title, testCase.fileName, duration, error);
    },
    // "Ran X tests. Y passed, Z failed"
    onRunComplete({ total, passed, failed, duration, numFiles }) {
        const fails = this.fails.map(({ testCase, error, duration }, idx) => [
            testCase
                ? `${INDENT}${red(`${idx + 1}) ${testCase.fileName}`)} ${dim("›")} ${red(testCase.title)}${duration ? ` (${formatTime(duration)})` : ''}\n`
                : undefined,
            INDENT + formatError(error, 1),
        ].filter(Boolean).join('\n')).join('\n\n');
        return [
            fails.trim().length
                ? colorize(Effect.Underline, '\n\nSummary of all failed tests\n\n')
                : green('\n\n✔︎ All is fine!'),
            fails.trim().length ? fails : undefined,
            '\n',
            `${colorize(Effect.Bold, 'Files')}:\t\t${[
                this.failedFiles.size ? red(`${this.failedFiles.size} failed`) : undefined,
                this.passedFiles.size ? green(`${this.passedFiles.size} passed`) : `${this.passedFiles.size} passed`,
            ].filter(Boolean).join(', ')}, ${numFiles} total`,
            `${colorize(Effect.Bold, 'Tests')}:\t\t${[
                failed ? red(`${failed} failed`) : undefined,
                passed ? green(`${passed} passed`) : `${passed} passed`,
            ].filter(Boolean).join(', ')}, ${total} total`,
            `${colorize(Effect.Bold, 'Duration')}:\t${formatTime(duration)} (${formatTime(Number((duration / total).toFixed(1)))} avg)`,
        ].filter(Boolean).join("\n");
    },
    onError(reason, error) {
        this.fails.push({
            error: error || new Error('Unknown error'),
        });
        return `${badge(BgColor.Yellow, 'ERR')} ${reason}`;
    },
};
export default LolTest2Reporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9sdGVzdDItcmVwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVwb3J0ZXJzL2xvbHRlc3QyLXJlcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3RGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQztBQUVwQixtRkFBbUY7QUFDbkYsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFXLEVBQUUsR0FBVyxFQUFVLEVBQUUsQ0FDN0MsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTVELE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBNEIsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFVLEVBQUU7SUFDckUsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO1FBQ1gsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxD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