import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

/** The main process which forks child processes for each test. */
export const runMain = (self: string, testDir: string, filter: string) => {
    const target = findTarget(testDir, filter);
    const child = child_process.fork(self, ['--child-runner', target]);
    child.addListener('exit', childExit => {
        // die when child dies.
        const code = childExit ? childExit : 0;
        process.exit(code);
    });
};

/** Find a target to start child process from. */
export const findTarget = (testDir: string, filter: string): string => {
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
};

// TODO: recursive dir scanning
export const scan = (dir: string): string[] => {
    const allFiles = fs.readdirSync(dir);
    return allFiles.filter(n => !n.startsWith('_') && (n.endsWith('ts') || n.endsWith('js')));
};

