/** Declare a test. */
export declare type TestFunction = {
    (name: string, testfn: () => any | Promise<any>): void;
    <S>(name: string, before: () => S | Promise<S>, testfn: (s: S) => any | Promise<any>, after?: (s: S) => any | Promise<any>): void;
    <S>(name: string, def: {
        before?: () => S | Promise<S>;
        testfn: (s: S) => any | Promise<any>;
        after?: (s: S) => any | Promise<any>;
    }): void;
};
/** Declare a test impl. */
export declare const test: TestFunction;
