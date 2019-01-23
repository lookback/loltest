import { AssertionError } from 'assert';
import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

/** Declare a test function. */
export const it = (name: string, fn: () => any | Promise<any>) => {
    itTests.push({ name, fn });
};

// put tests into here.
const itTests: TestRun[] = [];

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
    const testPaths = getTestPaths(conf.target);
    const allTests = testPaths.map(test);
    Promise.all(allTests)
        .then((results) => {
            const flat: boolean[] = Array.prototype.concat.apply([], results);
            const allGood = flat.reduce((p: boolean, c) => p && c);
            process.exit(allGood ? 0 : 1);
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

function test(testPath: string): Promise<boolean[]> {
    const testFile = path.basename(testPath);
    require(testPath);
    const tests = itTests.splice(0, itTests.length);
    if (tests.length) {
        const all = tests.map(async ({ name, fn }) => {
            try {
                await Promise.resolve().then(fn);
                console.log('✔︎', testFile, name);
                return true;
            } catch (e) {
                const c = e.stack.split('\n');
                const t = e instanceof AssertionError ? e.message : c[0];
                const s = [t, c[1]].join('\n');
                console.log('\x1b[31m✗\x1b[0m', testFile, `${name}:`, s);
                return false;
            }
        });
        return Promise.all(all);
    } else {
        console.log(' ', testFile, 'No tests found');
    }
    return Promise.resolve([]);
}
