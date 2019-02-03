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
};

export default TAPReporter;
