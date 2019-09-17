enum Color {
    Green = "\x1b[32m",
    Red = "\x1b[31m",
    Reset = "\x1b[0m",
    Yellow = "\x1b[33m",
    Dim = "\x1b[90m",
    White = "\x1b[97m",
}

type ColorFn = (str: any) => string;

export const colorize = (color: Color, str: any) => `${color}${String(str)}${Color.Reset}`;

export const red: ColorFn = colorize.bind(null, Color.Red);
export const green: ColorFn = colorize.bind(null, Color.Green);
export const yellow: ColorFn = colorize.bind(null, Color.Yellow);
export const dim: ColorFn = colorize.bind(null, Color.Dim);
