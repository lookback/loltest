/** The main process which forks child processes for each test. */
export declare const runMain: (self: string, testDir: string, filter: string) => void;
/** Find a target to start child process from. */
export declare const findTarget: (testDir: string, filter: string) => string;
export declare const scan: (dir: string) => string[];
