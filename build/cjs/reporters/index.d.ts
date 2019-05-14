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
export declare type ReporterOutput = string | undefined;
export interface Reporter {
    /** Call before test run starts */
    startRun: (opts: ReporterStart) => ReporterOutput;
    /** Call for each test case */
    test: (opts: TestCaseReport) => ReporterOutput;
    /** Call after test run ends */
    finishRun: (stats: ReporterStats) => ReporterOutput;
    bail: (reason?: string) => ReporterOutput;
}
