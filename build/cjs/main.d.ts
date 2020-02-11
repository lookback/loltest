export interface RunConfiguration {
    testDir: string;
    buildDir: string;
    maxChildCount: number;
    reporter: string;
    /** Filter for which test files to run. */
    filter?: string;
    /** Filter for test names to run. Can be regex. */
    testFilter?: string;
}
/** The main process which forks child processes for each test. */
export declare const runMain: (self: string, config: RunConfiguration) => void;
/** Find a target to start child process from. */
export declare const findTarget: (testDir: string, filter?: string | undefined) => string;
