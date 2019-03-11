import path from 'path';
import { foundTests, runChild, RunConf } from './child';
import { runMain } from './main';
import { mkParseArgs } from './lib/parse-cli-args';

const parseArgs = mkParseArgs({
    '--reporter': String,
});

/** Declare a test. */
export type TestFunction = {
    (name: string, testfn: () => any | Promise<any>): void;

    <S>(
        name: string,
        before: () => S | Promise<S>,
        testfn: (s: S) => any | Promise<any>,
        after?: (s: S) => any | Promise<any>,
    ): void;

    <S>(name: string, def: {
        before?: () => S | Promise<S>,
        testfn: (s: S) => any | Promise<any>,
        after?: (s: S) => any | Promise<any>,
    }): void;
};

/** Declare a test impl. */
export const test: TestFunction = (name: string, ...as: any) => {
    if (typeof as[0] == 'function') {
        if (as.length == 1) {
            foundTests.push({
                name,
                testfn: as[0],
            });
        } else {
            foundTests.push({
                name,
                before: as[0],
                testfn: as[1],
                after: as[2],
            });
        }
    } else {
        foundTests.push({
            name,
            ...as[0],
        });
    }
};

const argv = process.argv;

// fish out the childrunner start arg
const runConf: RunConf | null = (() => {
    const n = argv.indexOf('--child-runner');
    return n >= 0 ? {
        target: argv[n + 1],
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

    // `loltest some-file --tap` vs `loltest --tap some-file`
    const isPassingFilterFirst = !!argv[2]
        && !argv[2].startsWith('--');

    const filter = argv.slice(2).length > 1
        ? isPassingFilterFirst ? argv[2] : argv[argv.length - 1]
        : isPassingFilterFirst ? argv[2] : undefined;

    const cliArgs = parseArgs(isPassingFilterFirst
        ? argv.slice(3)
        : argv.slice(2, Math.max(argv.length - 1, 3))
    );

    runMain(pathToSelf, {
        testDir,
        filter,
        reporter: cliArgs['--reporter'],
    });
}
