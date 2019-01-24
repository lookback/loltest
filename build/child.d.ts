export interface RunConf {
    target: string;
}
export interface TestRun {
    name: string;
    before?: () => any;
    testfn: (a?: any) => any;
    after?: (a?: any) => any;
}
export declare const foundTests: TestRun[];
export declare const runChild: (conf: RunConf) => Promise<void>;
