interface RunConfiguration {
    testDir: string;
    reporter?: string;
    filter?: string;
}
/** The main process which forks child processes for each test. */
export declare const runMain: (self: string, config: RunConfiguration) => void;
/** Find a target to start child process from. */
export declare const findTarget: (testDir: string, filter?: string | undefined) => string;
export {};
