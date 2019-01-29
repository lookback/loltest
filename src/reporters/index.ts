interface ReporterTestOptions {
    /** What order does this test have? */
    index: number;
    /** Indicates whether the test passed or not */
    passed: boolean;
    /** The filename of this test */
    fileName: string;
    /** Optional error if `passed` is true */
    error?: Error;
}

interface ReporterStats {
    /** Total number of tests */
    total: number;
    /** Total passed tests */
    passed: number;
    /** Total failed tests */
    failed: number;
}

type ReporterOutput = string | undefined;

export interface Reporter {
    /** Call before test run starts */
    startRun: (opts: { total: number, numFiles: number }) => ReporterOutput;

    /** Call for each test case */
    test: (title: string, opts: ReporterTestOptions) => ReporterOutput;

    /** Call after test run ends */
    finishRun: (stats: ReporterStats) => ReporterOutput;
}
