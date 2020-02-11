import { TestCaseReport, ReporterStart, TestCase } from './reporters';
export interface RunConf {
    target: string;
    buildDir: string;
    testNameFilter?: string;
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
export declare type Message = TestResultMessage | RunCompleteMessage | RunStartMessage | TestErrorMessage | TestStartMessage;
export interface TestStartMessage {
    kind: 'test_start';
    payload: TestCase;
}
export interface TestResultMessage {
    kind: 'test_result';
    payload: TestCaseReport;
}
export interface RunCompleteMessage {
    kind: 'run_complete';
}
export interface RunStartMessage {
    kind: 'run_start';
    payload: ReporterStart;
}
export interface TestErrorMessage {
    kind: 'test_error';
    error: string;
}
export declare const foundTests: TestRun[];
export declare const runChild: (conf: RunConf) => Promise<void>;
