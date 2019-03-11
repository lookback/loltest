import { Reporter } from ".";
import { red } from "../lib/colorize";

const DotReporter: Reporter = {
    startRun: ({ numFiles, total }) => '',

    test: ({ title, passed, index, error, duration }) =>
        passed ? '.' : red('.'),

    // "Ran X tests. Y passed, Z failed"
    finishRun: ({ total, passed, failed, duration }) =>
        `\n\n${passed}/${total} in ${duration} ms`,

    bail: reason => '',
};

export default DotReporter;
