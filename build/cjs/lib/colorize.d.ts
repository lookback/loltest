export declare enum FgColor {
    Black = 30,
    Red = 31,
    Green = 32,
    Yellow = 33,
    Default = 39,
    Grey = 37,
    Dim = 90,
    White = 97
}
export declare enum BgColor {
    Red = 41,
    Green = 42,
    Yellow = 43,
    Blue = 44,
    Grey = 47,
    DarkGrey = 100,
    White = 107,
    Default = 49
}
export declare enum Effect {
    Reset = 0,
    Bold = 1,
    Dim = 2,
    Underline = 4,
    Hidden = 8
}
declare type Composition = {
    front: FgColor;
    back: BgColor;
    effect?: Effect;
};
declare type ColorFn = (str: any) => string;
export declare const colorize: (color: FgColor | BgColor | Effect | Composition, str: any) => string;
export declare const red: ColorFn;
export declare const green: ColorFn;
export declare const yellow: ColorFn;
export declare const dim: ColorFn;
export {};
