const toCamelCase = (str: string): string =>
    str.toLowerCase().replace(/_(.)/g, (_, s: string) => s.toUpperCase());

/** Parse `envKeys` from the provided env object to a dict with `envKeys` as camel cased. */
export const envToConf = (
    env: NodeJS.ProcessEnv,
    envKeys: string[]
): { [k: string]: string | undefined } => {
    const parsed = envKeys
        .filter(k => !!env[k])
        .map(k => ({ [toCamelCase(k)]: env[k] }));

    return parsed.length ? Object.assign.call(null, ...parsed) : {};
};
