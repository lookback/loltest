import { Reporter } from ".";

const TAPReporter: Reporter = {
    startRun: ({ numFiles, total }) =>
        `TAP version 13\n1..${total}`,

    test: ({ title, passed, index }) => {
        return `${passed ? '': 'not '}ok ${index + 1} ${title}`;
    },

    finishRun: () => {
        return '';
    },

    bail: (reason) =>
        // This is lol: http://testanything.org/tap-version-13-specification.html#bail-out
        `Bail out! ${reason}`,
};

export default TAPReporter;
