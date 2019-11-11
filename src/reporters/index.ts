import { SerializedError } from "../lib/serialize-error";

export interface ReporterStart {
    total: number;
    numFiles: number;
}

export interface TestCaseReport {
    /** The name of the test case */
    title: string;
    /** What order does this test have? */
    index: number;
    /** Indicates whether the test passed or not */
    passed: boolean;
    /** The filename of this test */
    fileName: string;
    /** Error, if `passed` is false */
    error?: Error | SerializedError;
    /** Duration to run this test, in milliseconds */
    duration: number;
}

export interface ReporterStats {
    /** Total number of tests */
    total: number;
    /** Total passed tests */
    passed: number;
    /** Total failed tests */
    failed: number;
    /** Duration in milliseconds */
    duration: number;
}

export type ReporterOutput = string | undefined;

export interface Reporter {
    /** Call before test run starts. */
    onRunStart: (opts: ReporterStart) => ReporterOutput;

    /** Call for each test case when it's finished. */
    onTestResult: (opts: TestCaseReport) => ReporterOutput;

    /** Call after test run ends. */
    onRunComplete: (stats: ReporterStats) => ReporterOutput;

    /** Call when an error occurred in *setting up the test*, not within the test itself. */
    onError: (reason: string, error?: Error) => ReporterOutput;
}
