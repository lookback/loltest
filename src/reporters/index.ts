import { SerializedError } from '../lib/serialize-error';

export interface TestCase {
    /** The name of the test case */
    title: string;
    /** What order does this test have? */
    index: number;
    /** The filename of this test */
    fileName: string;
}

export interface ReporterStart {
    total: number;
    numFiles: number;
}

export interface TestCaseReport {
    testCase: TestCase;
    /** Indicates whether the test passed or not */
    passed: boolean;
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
    /** Total number of test files found. */
    numFiles: number;
}

export type Output = (msg?: string) => void;

export interface Reporter {
    /** Call when compilation starts. */
    onCompileStart: (out: Output) => void;

    /** Call when compilation ends. */
    onCompileEnd: (
        stats: {
            numFiles: number;
            duration: number;
        },
        out: Output
    ) => void;

    /** Call before test run starts. */
    onRunStart: (opts: ReporterStart, out: Output) => void;

    /** Call before test case starts. */
    onTestStart: (testCase: TestCase, out: Output) => void;

    /** Call for a finished test case. */
    onTestResult: (opts: TestCaseReport, out: Output) => void;

    /** Call after test run ends. */
    onRunComplete: (stats: ReporterStats, out: Output) => void;

    /** Call when an error occurred in *setting up the test*, not within the test itself. */
    onError: (reason: string, error: Error | undefined, out: Output) => void;
}
