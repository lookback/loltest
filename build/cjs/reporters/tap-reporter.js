"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const is_plain_object_1 = require("../lib/is-plain-object");
const getStackInfo = (stack) => {
    const stackArr = stack.split('\n');
    const stackLine = stackArr[0].includes('ERR_ASSERTION') ? stackArr[1] : stackArr[0];
    const match = stackLine.match(/\((\/.*)\)/);
    if (!match) {
        return stackLine;
    }
    const base = path_1.basename(match[1]);
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
    .map(([key, val]) => `${' '.repeat(indent)}${key}: ${is_plain_object_1.isPlainObject(val)
    ? `\n${toYAML(val, indent + 3)}`
    : String(val)}`)
    .join(`\n`);
const outputDiagnostics = (obj) => `
   ---
${toYAML(obj, 3)}
   ...
`;
const logSuccess = (title, index) => `ok ${index + 1} - ${title}`;
const logFailure = (title, index, error) => `not ok ${index + 1} - ${title}` + (error ? outputDiagnostics(formatError(error)) : '');
const outputDirectives = ({ duration }) => `${duration !== 0 ? ' # time=' + duration + 'ms' : ''}`;
const TAPReporter = {
    startRun: ({ numFiles, total }) => `TAP version 13\n1..${total}`,
    test: ({ title, passed, index, error, duration }) => '\n' + (passed ? logSuccess(title, index) : logFailure(title, index, error)) +
        outputDirectives({ duration }),
    finishRun: () => {
        return "";
    },
    bail: reason => 
    // This is lol: http://testanything.org/tap-version-13-specification.html#bail-out
    `Bail out! ${reason}`,
};
exports.default = TAPReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwLXJlcG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlcG9ydGVycy90YXAtcmVwb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBZ0M7QUFHaEMsNERBQXVEO0FBRXZELE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBYSxFQUE2RCxFQUFFO0lBQzlGLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckYsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUU1QyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsT0FBTyxTQUFTLENBQUM7S0FDcEI7SUFFRCxNQUFNLElBQUksR0FBRyxlQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDO0lBRTlFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHLENBQUMsS0FBc0IsRUFBVSxFQUFFO0lBQ25ELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUVsRSxPQUFPO1FBQ0gsS0FB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