declare type Handler = (value: string) => any;
interface Spec {
    [key: string]: Handler;
}
declare type Argument = string;
declare type Result<S extends Spec, A extends Argument> = {
    [k in keyof S]?: ReturnType<S[k]>;
} & {
    [a in A]?: string;
};
/** Create a parser for string arguments, often `process.argv`. */
export declare const mkParseArgs: <S extends Spec, A extends string>(options: S, format?: A[] | undefined) => (argv: string[]) => Result<S, A>;
export {};
