import { TestCaseReport, ReporterStart, TestCase, Init } from './reporters';
import { TestMeta } from '.';
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
    before?: (meta: TestMeta) => any;
    testfn: (a?: any & TestMeta) => any;
    after?: (a?: any & TestMeta) => any;
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
export declare type Message = TestResultMessage | RunCompleteMessage | RunStartMessage | TestErrorMessage | TestStartMessage | InitMessage;
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
export interface InitMessage {
    kind: 'init';
    payload: Init;
}
export interface TestErrorMessage {
    kind: 'test_error';
    error: string;
}
export declare const foundTests: TestRun[];
export declare const runChild: (conf: RunConf) => Promise<void>;
