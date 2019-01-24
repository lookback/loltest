import fs from 'fs';
import path from 'path';
import { AssertionError } from 'assert';
import { scan } from './main';

export interface RunConf {
    target: string;
}

export interface TestRun {
    name: string;
    before?: () => any;
    testfn: (a?: any) => any;
    after?: (a?: any) => any;
}

// test() puts tests into here.
export const foundTests: TestRun[] = [];

// Child process test runner
export const runChild = async (conf: RunConf): Promise<void> => {
    // tslint:disable-next-line:no-let
    let uncaughtException = false, unhandledRejection = false;
    process.on('uncaughtException', (e) => {
        console.log('Uncaught exception:', e);
        uncaughtException = true;
    });
    process.on('unhandledRejection', (e) => {
        console.log('Unhandled promise rejection:', e);
        unhandledRejection = true;
    });

    const testPaths = getTestPaths(conf.target);
    const allTests = testPaths.map(doTest);
    Promise.all(allTests)
        .then((results) => {
            const flat: boolean[] = Array.prototype.concat.apply([], results);
            const allGood = flat.reduce((p: boolean, c) => p && c);
            const clean = allGood && !uncaughtException && !unhandledRejection;
            console.log(allGood, uncaughtException, unhandledRejection);
            process.exit(clean ? 0 : 1);
        });
};

const getTestPaths = (target: string): string[] => {
    const stat = fs.statSync(target);
    if (stat.isFile()) {
        return [target];
    } else if (stat.isDirectory()) {
        return scan(target).map(n => path.join(target, n));
    }
    console.error("Neither file nor directory", target);
    return process.exit(1);
};

const doTest = (testPath: string): Promise<boolean[]> => {
    const testFile = path.basename(testPath);
    require(testPath);
    const tests = foundTests.splice(0, foundTests.length);
    if (tests.length) {
        const all = tests.map(async ({ name, before, testfn, after }) => {
            // run before and save the args
            const args = await tryRun(testFile, name, 'BEFORE', before);
            if (isFail(args)) {
                // abort if BEFORE failed.
                return false;
            }
            const testResult = await tryRun(testFile, name, '', () => testfn(args));
            // always run AFTER, regardless of testResult.
            await tryRun(testFile, name, 'AFTER', () => after && after(args));
            if (!isFail(testResult)) {
                console.log('✔︎', testFile, name);
                return true;
            }
            return false;
        });
        return Promise.all(all);
    } else {
        console.log(' ', testFile, 'No tests found');
    }
    return Promise.resolve([]);
};

const Fail = {
    fail: true,
};
const isFail = (t: any): t is typeof Fail => t === Fail;

const tryRun = <T>(
    testFile: string,
    name: string,
    phase: string,
    fn: (() => Promise<T>) | undefined,
): Promise<T | typeof Fail> => Promise.resolve().then(fn)
    .catch(e => {
        const pfxname = phase ? `${phase} ${name}` : name;
        const msg = errorMessage(testFile, pfxname, e);
        console.log(...msg);
        return Fail;
    });

const ERR_PRELUDE = '\x1b[31m✗\x1b[0m';

const errorMessage = (testFile: string, name: string, e: any): string[] => {
    const msg = (() => {
        if (e instanceof Error) {
            if (e.stack) {
                const c = e.stack.split('\n');
                const t = e instanceof AssertionError ? e.message : c[0];
                return [t, c[1]].join('\n');
            } else {
                return e.message;
            }
        } else {
            return e;
        }
    })();
    return [ERR_PRELUDE, testFile, `${name}:`, msg];
};

