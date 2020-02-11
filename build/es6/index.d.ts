/** Declares a test case to be run. */
export declare type Test = {
    /** Declare a test case with a name and function body. */
    (name: string, testfn: () => any | Promise<any>): void;
    /** Declare a test case with a name and a `before` function.
     * Optionally provide an `after` function. */
    <S>(name: string, before: (meta: TestMeta) => S | Promise<S>, testfn: (s: S & TestMeta) => any | Promise<any>, after?: (s: S & TestMeta) => any | Promise<any>): void;
    /** Declare a test case with a name. */
    <S>(name: string, def: {
        before?: (meta: TestMeta) => S | Promise<S>;
        testfn: (s: S & TestMeta) => any | Promise<any>;
        after?: (s: S & TestMeta) => any | Promise<any>;
    }): void;
};
export interface TestMeta {
    /** Name of the test being run. */
    testCaseName: string;
}
export declare const test: Test;
