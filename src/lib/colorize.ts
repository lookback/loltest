enum Color {
    Green = "\x1b[32m",
    Red = "\x1b[31m",
    Reset = "\x1b[0m",
    Yellow = "\x1b[33m",
    Dim = "\x1b[90m",
    White = "\x1b[97m",
}

type ColorFn = (str: string) => string;

export const colorize = (color: Color, str: string) => `${color}${str}${Color.Reset}`;

export const red: ColorFn = colorize.bind(null, Color.Red);
export const green: ColorFn = colorize.bind(null, Color.Green);
export const dim: ColorFn = colorize.bind(null, Color.Dim);
