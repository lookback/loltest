export enum FgColor {
    Black = 30,
    Red = 31,
    Green = 32,
    Yellow = 33,
    Default = 39,
    Grey = 37,
    Dim = 90,
    White = 97,
}

export enum BgColor {
    Red = 41,
    Green = 42,
    Yellow = 43,
    Blue = 44,
    Grey = 47,
    DarkGrey = 100,
    White = 107,
    Default = 49,
}

export enum Effect {
    Reset = 0,
    Bold = 1,
    Dim = 2,
    Underline = 4,
    Hidden = 8,
}

type Composition = {
    front: FgColor;
    back: BgColor;
    effect?: Effect;
};

type Component = FgColor | BgColor | Effect;

const sequence = (c1?: Component, c2?: Component, c3?: Component): string =>
    `\x1b[${[c1, c2, c3].filter(Boolean).join(';')}m`;

const isComposition = (t: any): t is Composition =>
    !!t && !!t.back && !!t.front;

type ColorFn = (str: any) => string;

export const colorize = (color: Component | Composition, str: any) =>
    `${
        isComposition(color)
            ? sequence(color.front, color.back, color.effect)
            : sequence(color)
    }${String(str)}${sequence(Effect.Reset)}`;

export const red: ColorFn = colorize.bind(null, FgColor.Red);
export const green: ColorFn = colorize.bind(null, FgColor.Green);
export const yellow: ColorFn = colorize.bind(null, FgColor.Yellow);
export const dim: ColorFn = colorize.bind(null, FgColor.Dim);
