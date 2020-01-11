/** Flattens a multi dimensional array. */
export const flatten = <T>(arr: T[][]): T[] =>
    Array.prototype.concat.apply([], arr);
