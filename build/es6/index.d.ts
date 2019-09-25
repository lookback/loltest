/** Declares a test case to be run. */
export declare type Test = {
    /** Declare a test case with a name and function body. */
    (name: string, testfn: () => any | Promise<any>): void;
    /** Declare a test case with a name and a `before` function.
     * Optionally provide an `after` function. */
    <S>(name: string, before: () => S | Promise<S>, testfn: (s: S) => any | Promise<any>, after?: (s: S) => any | Promise<any>): void;
    /** Declare a test case with a name. */
    <S>(name: string, def: {
        before?: () => S | Promise<S>;
        testfn: (s: S) => any | Promise<any>;
        after?: (s: S) => any | Promise<any>;
    }): void;
};
export declare const test: Test;
