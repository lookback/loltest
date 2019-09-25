declare type Handler = (value: string) => any;
interface Spec {
    [key: string]: Handler;
}
/** Create a parser for string arguments, often `process.argv`. */
export declare const mkParseArgs: <S extends Spec, A extends string>(options: S, format?: A[] | undefined) => (argv: string[]) => { [k in keyof S]?: ReturnType<S[k]> | undefined; } & { [a in A]?: string | undefined; };
export {};
