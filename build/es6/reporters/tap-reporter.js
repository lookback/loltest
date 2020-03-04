// tslint:disable no-object-mutation
import { basename } from 'path';
import { isPlainObject } from '../lib/is-plain-object';
const getStackInfo = (stack) => {
    const stackArr = stack.split('\n');
    const stackLine = stackArr[0].includes('ERR_ASSERTION')
        ? stackArr[1]
        : stackArr[0];
    const match = stackLine.match(/\((\/.*)\)/);
    if (!match) {
        return stackLine;
    }
    const base = basename(match[1]);
    const [, file, line, column] = base.match(/(.*):(\d+):(\d+)/) || [];
    return { file, line, column };
};
const formatError = (error) => {
    const stack = error.stack ? getStackInfo(error.stack) : undefined;
    return {
        error: error.name,
        message: error.message,
        at: stack ? stack : undefined,
    };
};
const toYAML = (obj, indent = 0) => Object.entries(obj)
    .map(([key, val]) => `${' '.repeat(indent)}${key}: ${isPlainObject(val)
    ? `\n${toYAML(val, indent + 3)}`
    : String(val)}`)
    .join(`\n`);
const outputDiagnostics = (obj) => `
   ---
${toYAML(obj, 3)}
   ...
`;
const logSuccess = (title, index) => `ok ${index} - ${title}`;
const logFailure = (title, index, error) => `not ok ${index} - ${title}` +
    (error ? outputDiagnostics(formatError(error)) : '');
const outputDirectives = ({ duration }) => `${duration !== 0 ? ' # time=' + duration + 'ms' : ''}`;
const TAPReporter = {
    currentIndex: 0,
    totalNumTests: 0,
    onCompileStart: (out) => out(),
    onCompileEnd: (_, out) => out(),
    onInit() { },
    onRunStart(_, out) {
        out(`TAP version 13`);
    },
    onTestStart(_, __) {
        this.totalNumTests++;
    },
    onTestResult({ testCase, passed, error, duration }, out) {
        this.currentIndex++;
        out('\n' +
            (passed
                ? logSuccess(testCase.title, this.currentIndex)
                : logFailure(testCase.title, this.currentIndex, error)) +
            outputDirectives({ duration }));
    },
    // http://testanything.org/tap-version-13-specification.html#the-plan
    onRunComplete(out) {
        out(`1..${this.totalNumTests}`);
    },
    onError: (error, out) => 
    // This is lol: http://testanything.org/tap-version-13-specification.html#bail-out
    out(`Bail out! ${error}`),
};
export default TAPReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwLXJlcG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlcG9ydGVycy90YXAtcmVwb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0NBQW9DO0FBQ3BDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHaEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRXZELE1BQU0sWUFBWSxHQUFHLENBQ2pCLEtBQWEsRUFDNEMsRUFBRTtJQUMzRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO1FBQ25ELENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTVDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDUixPQUFPLFNBQVMsQ0FBQztLQUNwQjtJQUVELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO0lBRXpDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHLENBQUMsS0FBc0IsRUFBVSxFQUFFO0lBQ25ELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlB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