declare enum Color {
    Green = "\u001B[32m",
    Red = "\u001B[31m",
    Reset = "\u001B[0m",
    Yellow = "\u001B[33m",
    Dim = "\u001B[90m",
    White = "\u001B[97m"
}
declare type ColorFn = (str: any) => string;
export declare const colorize: (color: Color, str: any) => string;
export declare const red: ColorFn;
export declare const green: ColorFn;
export declare const dim: ColorFn;
export {};
