import { basename } from 'path';
import { Reporter } from '.';
import { SerializedError } from '../lib/serialize-error';
import { isPlainObject } from '../lib/is-plain-object';

const getStackInfo = (
    stack: string
): { line?: string; column?: string; file: string } | string => {
    const stackArr = stack.split('\n');
    const stackLine = stackArr[0].includes('ERR_ASSERTION')
        ? stackArr[1]
        : stackArr[0];
    const match = stackLine.match(/\((\/.*)\)/);

    if (!match) {
        return stackLine;
    }

    const base = basename(match[1]);
    const [, file, line, column]: string[] =
        base.match(/(.*):(\d+):(\d+)/) || [];

    return { file, line, column };
};

const formatError = (error: SerializedError): object => {
    const stack = error.stack ? getStackInfo(error.stack) : undefined;

    return {
        error: error.name,
        message: error.message,
        at: stack ? stack : undefined,
    };
};

const toYAML = (obj: object, indent = 0): string =>
    Object.entries(obj)
        .map(
            ([key, val]) =>
                `${' '.repeat(indent)}${key}: ${
                    isPlainObject(val)
                        ? `\n${toYAML(val, indent + 3)}`
                        : String(val)
                }`
        )
        .join(`\n`);

const outputDiagnostics = (obj: any): string =>
    `
   ---
${toYAML(obj, 3)}
   ...
`;

const logSuccess = (title: string, index: number) =>
    `ok ${index + 1} - ${title}`;

const logFailure = (title: string, index: number, error?: SerializedError) =>
    `not ok ${index + 1} - ${title}` +
    (error ? outputDiagnostics(formatError(error)) : '');

const outputDirectives = ({ duration }: { duration: number }) =>
    `${duration !== 0 ? ' # time=' + duration + 'ms' : ''}`;

const TAPReporter: Reporter = {
    onRunStart: ({ numFiles, total }, out) =>
        out(`TAP version 13\n1..${total}`),

    onTestStart: (_, out) => out(),

    onTestResult: ({ testCase, passed, error, duration }, out) =>
        out(
            '\n' +
                (passed
                    ? logSuccess(testCase.title, testCase.index)
                    : logFailure(testCase.title, testCase.index, error)) +
                outputDirectives({ duration })
        ),

    onRunComplete: (_, out) => out(''),

    onError: (reason, error, out) =>
        // This is lol: http://testanything.org/tap-version-13-specification.html#bail-out
        out(`Bail out! ${reason}`),
};

export default TAPReporter;
