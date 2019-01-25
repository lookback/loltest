import path from 'path';
import { foundTests, runChild, RunConf } from './child';
import { runMain } from './main';

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
    runChild(runConf);
} else {
    const self = argv[1]; // 0 is nodejs itself
    const testDir = path.join(process.cwd(), 'test');
    const filter = argv[2];
    runMain(self, testDir, filter);
}
