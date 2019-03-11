declare enum Color {
    Green = "\u001B[32m",
    Red = "\u001B[31m",
    Reset = "\u001B[0m"
}
declare type ColorFn = (str: string) => string;
export declare const colorize: (color: Color, str: string) => string;
export declare const red: ColorFn;
export declare const green: ColorFn;
export {};
