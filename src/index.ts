import path from 'path';
import { foundTests, runChild, RunConf, TestRun } from './child';
import { runMain } from './main';
import { mkParseArgs } from './lib/parse-cli-args';

const parseArgs = mkParseArgs({
    reporter: String,
}, ['fileFilter', 'testFilter']);

/** Declares a test case to be run. */
export type Test = {
    /** Declare a test case with a name and function body. */
    (name: string, testfn: () => any | Promise<any>): void;

    /** Declare a test case with a name and a `before` function.
     * Optionally provide an `after` function. */
    <S>(
        name: string,
        before: () => S | Promise<S>,
        testfn: (s: S) => any | Promise<any>,
        after?: (s: S) => any | Promise<any>,
    ): void;

    /** Declare a test case with a name. */
    <S>(name: string, def: {
        before?: () => S | Promise<S>,
        testfn: (s: S) => any | Promise<any>,
        after?: (s: S) => any | Promise<any>,
    }): void;
};

const createTest = (name: string, obj: any): TestRun => {
    if (typeof obj[0] === 'function') {
        if (obj.length === 1) {
            return {
                name,
                testfn: obj[0],
            };
        } else {
            return {
                name,
                before: obj[0],
                testfn: obj[1],
                after: obj[2],
            };
        }
    } else {
        return {
            name,
            ...obj[0],
        };
    }
};

export const test: Test = (name: string, ...as: any) => {
    foundTests.push(createTest(name, as));
};

const argv = process.argv;

// fish out the childrunner start arg
const runConf = ((): RunConf | null => {
    const n = argv.indexOf('--child-runner');
    const t = argv.indexOf('--test-filter');

    return n >= 0 ? {
        target: argv[n + 1],
        testFilter: t !== -1 ? argv[t + 1] : undefined,
    } : null;
})();

/** Switch depending on whether we're the forked child or not. */
if (runConf) {
    // run as child
    require('ts-node').register(); // so we can require .ts-files
    runChild(runConf)
        .catch(e => {
            console.log("Tests failed", e);
            process.exit(1);
        });
} else {
    const pathToSelf = argv[1]; // 0 is nodejs itself
    const testDir = path.join(process.cwd(), 'test');

    const cliArgs = parseArgs(argv.slice(2));

    runMain(pathToSelf, {
        testDir,
        reporter: cliArgs.reporter,
        filter: cliArgs.fileFilter,
        testFilter: cliArgs.testFilter,
    });
}
