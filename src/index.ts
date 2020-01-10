import path from 'path';
import { foundTests, runChild, RunConf, TestRun } from './child';
import { runMain, RunConfiguration } from './main';
import { mkParseArgs } from './lib/parse-cli-args';
import { yellow } from './lib/colorize';
import { envToConf } from './lib/env-to-config';
import { parseGlobalConf } from './lib/global-conf';

/** The directory in which to search for test files. */
const DEFAULT_TEST_DIR = 'test';

const parseArgs = mkParseArgs({}, ['fileFilter', 'testFilter']);

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
        after?: (s: S) => any | Promise<any>
    ): void;

    /** Declare a test case with a name. */
    <S>(
        name: string,
        def: {
            before?: () => S | Promise<S>;
            testfn: (s: S) => any | Promise<any>;
            after?: (s: S) => any | Promise<any>;
        }
    ): void;
};

const createTest = (name: string, obj: any): TestRun => {
    if (foundTests.find((t) => t.name === name)) {
        console.error(yellow(`Duplicate test case name: "${name}"`));
        process.exit(1);
    }

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

    return n >= 0
        ? {
              target: argv[n + 1],
              testFilter: t !== -1 ? argv[t + 1] : undefined,
          }
        : null;
})();

/** Switch depending on whether we're the forked child or not. */
if (runConf) {
    // run as child
    require('ts-node').register(); // so we can require .ts-files
    runChild(runConf).catch((e) => {
        console.log('Tests failed', e);
        process.exit(1);
    });
} else {
    // Read conf from ~/.loltest
    const globalConf = parseGlobalConf<RunConfiguration>('.loltest');
    // Read local conf from env vars
    const envConf = envToConf(process.env, [
        'LOLTEST_REPORTER',
        'LOLTEST_TEST_DIR',
    ]);

    const testDir = path.join(
        process.cwd(),
        envConf.loltestTestDir || globalConf.testDir || DEFAULT_TEST_DIR
    );

    const conf: Pick<RunConfiguration, 'reporter' | 'testDir'> = {
        reporter: envConf.loltestReporter || globalConf.reporter,
        testDir,
    };

    const pathToSelf = argv[1]; // 0 is nodejs itself

    const cliArgs = parseArgs(argv.slice(2));

    runMain(pathToSelf, {
        filter: cliArgs.fileFilter,
        testFilter: cliArgs.testFilter,
        ...conf,
    });
}
