declare type Handler = (value: string) => any;
interface Spec {
    [key: string]: Handler;
}
declare type Result<S extends Spec> = {
    [K in keyof S]?: ReturnType<S[K]>;
};
/** Create a parser for string arguments, often `process.argv`. */
export declare const mkParseArgs: <S extends Spec>(spec: S) => (argv: string[]) => Result<S>;
export {};
