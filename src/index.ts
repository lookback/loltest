import { AssertionError } from 'assert';
import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

/** Declare a test function. */
export const test = (name: string, fn: () => any | Promise<any>) => {
    foundTests.push({ name, fn });
};

// test() puts tests into here.
const foundTests: TestRun[] = [];

const argv = process.argv;

interface RunConf {
    target: string;
}

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
    run(runConf);
} else {
    // we need to start a child process.
    const self = argv[1]; // 0 is nodejs itself
    const testDir = path.join(process.cwd(), 'test');
    const filter = argv[2];
    const target = findTarget(testDir, filter);
    const child = child_process.fork(self, ['--child-runner', target]);
    child.addListener('exit', childExit => {
        // die when child dies.
        const code = childExit ? childExit : 0;
        process.exit(code);
    });
}

/** Find a target to start child process from. */
function findTarget(testDir: string, filter: string): string {
    if (filter) {
        const jsFiles = scan(testDir);
        const file = jsFiles.find(f => f.startsWith(filter));
        if (file) {
            return path.join(testDir, file);
        } else {
            console.error("No test file found for:", filter);
            process.exit(1);
        }
    }
    return testDir;
}

// TODO: recursive dir scanning
function scan(dir: string): string[] {
    const allFiles = fs.readdirSync(dir);
    return allFiles.filter(n => n.endsWith('ts') || n.endsWith('js'));
}

// Child process test runner
async function run(conf: RunConf): Promise<void> {
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
            process.exit(clean ? 0 : 1);
        });
}

function getTestPaths(target: string): string[] {
    const stat = fs.statSync(target);
    if (stat.isFile()) {
        return [target];
    } else if (stat.isDirectory()) {
        return scan(target).map(n => path.join(target, n));
    }
    console.error("Neither file nor directory", target);
    return process.exit(1);
}

interface TestRun {
    name: string;
    fn: () => any | Promise<any>;
}

function doTest(testPath: string): Promise<boolean[]> {
    const testFile = path.basename(testPath);
    require(testPath);
    const tests = foundTests.splice(0, foundTests.length);
    if (tests.length) {
        const all = tests.map(async ({ name, fn }) => {
            try {
                await Promise.resolve().then(fn);
                console.log('✔︎', testFile, name);
                return true;
            } catch (e) {
                const msg = errorMessage(e, testFile, name);
                console.log(...msg);
                return false;
            }
        });
        return Promise.all(all);
    } else {
        console.log(' ', testFile, 'No tests found');
    }
    return Promise.resolve([]);
}

const ERR_PRELUDE = '\x1b[31m✗\x1b[0m';

function errorMessage(e: any, testFile: string, name: string): string[] {
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
}

