import { TestCaseReport, ReporterStats, ReporterStart } from './reporters';
export interface RunConf {
    target: string;
}
/**
 * A single run of a test case.
 */
export interface TestRun {
    name: string;
    before?: () => any;
    testfn: (a?: any) => any;
    after?: (a?: any) => any;
}
/**
 * The result of a TestRun.
 */
export interface TestResult {
    name: string;
    filename: string;
    fail: boolean;
    error?: Error;
    duration: number;
}
export declare type Message = TestResultMessage | TestFinishedMessage | TestStartedMessage | TestErrorMessage;
export interface TestResultMessage {
    kind: 'test_result';
    payload: TestCaseReport;
}
export interface TestFinishedMessage {
    kind: 'test_finished';
    payload: ReporterStats;
}
export interface TestStartedMessage {
    kind: 'test_started';
    payload: ReporterStart;
}
export interface TestErrorMessage {
    kind: 'test_error_message';
    error?: Error;
}
export declare const foundTests: TestRun[];
export declare const runChild: (conf: RunConf) => Promise<void>;
