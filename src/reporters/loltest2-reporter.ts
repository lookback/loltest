import { Reporter, TestCase } from '.';
import { pluralize } from '../lib/pluralize';
import { formatTime } from '../lib/format-time';
import {
    BgColor,
    FgColor,
    green,
    red,
    dim,
    colorize,
    Effect,
} from '../lib/colorize';
import { SerializedError } from '../lib/serialize-error';

const INDENT = '  ';

/** Pad trail and beginning of string with whitespace to a desired total length. */
const pad = (str: string, len: number): string =>
    str
        .trim()
        .padEnd(len)
        .padStart(len + str.length / 2);

const formatError = (err: Error | SerializedError, indent = 0): string => {
    if (err.stack) {
        const c = err.stack.split('\n');
        const t = err.message
            .split('\n')
            .join('\n' + INDENT.repeat(indent + 1));
        return [t, c[1]].join('\n' + INDENT.repeat(indent));
    } else {
        return err.message.split('\n').join('\n' + INDENT.repeat(indent + 1));
    }
};

const badge = (color: BgColor, text: string) =>
    colorize({ back: color, front: FgColor.Black }, pad(text, 6));

/** Don't print durations (in milliseconds) below this threshold. */
const SHOW_TIME_THRESHOLD_MS = 20;

const time = (duration: number) =>
    duration > SHOW_TIME_THRESHOLD_MS ? dim(` (${formatTime(duration)})`) : '';

const logSuccess = (title: string, fileName: string, duration: number) =>
    `${badge(BgColor.Green, 'PASS')} ${colorize(Effect.Bold, fileName)} ${dim(
        '›'
    )} ${title}${time(duration)}`;

const logFail = (
    title: string,
    fileName: string,
    duration: number,
    error?: Error
) =>
    `${badge(BgColor.Red, 'FAIL')} ${colorize(Effect.Bold, fileName)} ${dim(
        '›'
    )} ${title}${time(duration)}`;

interface LolTest2Reporter extends Reporter {
    fails: {
        testCase?: TestCase;
        error: Error | SerializedError;
        duration?: number;
    }[];

    failedFiles: Set<string>;

    passedFiles: Set<string>;
}

const LolTest2Reporter: LolTest2Reporter = {
    fails: [],

    failedFiles: new Set(),

    passedFiles: new Set(),

    onCompileStart: (out) => out('Compiling…'),

    onCompileEnd: ({ numFiles, duration }, out) =>
        out(
            `Compiled ${numFiles} ${pluralize(
                'file',
                numFiles
            )} in ${formatTime(duration)}`
        ),

    onRunStart: ({ total, numFiles }, out) =>
        out(
            `${colorize(
                Effect.Underline,
                `Running ${total} ${pluralize(
                    'test',
                    total
                )} in ${numFiles} ${pluralize('file', numFiles)}...\n`
            )}`
        ),

    onTestStart: (testCase, out) => out(),
    // `${colorize(
    //     { back: BgColor.Yellow, front: FgColor.Black },
    //     " START "
    // )} ${testCase.fileName} ${dim("›")} ${testCase.title}`,

    onTestResult(report, out): void {
        const { testCase, passed, error, duration } = report;

        if (!passed) {
            this.fails.push({
                testCase,
                error: error || new Error('Unknown fail'),
                duration,
            });

            this.failedFiles.add(testCase.fileName);
            this.passedFiles.delete(testCase.fileName);
        } else if (!this.failedFiles.has(testCase.fileName)) {
            this.passedFiles.add(testCase.fileName);
        }

        out(
            passed
                ? logSuccess(testCase.title, testCase.fileName, duration)
                : logFail(testCase.title, testCase.fileName, duration, error)
        );
    },

    // "Ran X tests. Y passed, Z failed"
    onRunComplete({ total, passed, failed, duration, numFiles }, out): void {
        const fails = this.fails
            .map(({ testCase, error, duration }, idx) =>
                [
                    testCase
                        ? `${INDENT}${red(
                              `${idx + 1}) ${testCase.fileName}`
                          )} ${dim('›')} ${red(testCase.title)}${
                              duration ? ` (${formatTime(duration)})` : ''
                          }\n`
                        : undefined,
                    INDENT + formatError(error, 1),
                ]
                    .filter(Boolean)
                    .join('\n')
            )
            .join('\n\n');

        out(
            [
                fails.trim().length
                    ? colorize(
                          Effect.Underline,
                          '\n\nSummary of all failed tests\n\n'
                      )
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
                    .join(', ')}, ${numFiles} total`,

                `${colorize(Effect.Bold, 'Tests')}:\t\t${[
                    failed ? red(`${failed} failed`) : undefined,
                    passed ? green(`${passed} passed`) : `${passed} passed`,
                ]
                    .filter(Boolean)
                    .join(', ')}, ${total} total`,

                `${colorize(Effect.Bold, 'Duration')}:\t${formatTime(
                    duration
                )} (${formatTime(Number((duration / total).toFixed(1)))} avg)`,
            ]
                .filter(Boolean)
                .join('\n')
        );
    },

    onError(reason, error, out): void {
        this.fails.push({
            error: error || new Error('Unknown error'),
        });

        out(`${badge(BgColor.Yellow, 'ERR')} ${reason}`);
    },
};

export default LolTest2Reporter;
