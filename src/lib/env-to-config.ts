const toCamelCase = (str: string): string =>
    str.toLowerCase().replace(/_(.)/g, (_, s: string) => s.toUpperCase());

/** Parse `envKeys` from the provided env object to a dict with `envKeys` as camel cased. */
export const envToConf = (
    env: NodeJS.ProcessEnv,
    envKeys: string[],
): {[k: string]: string | undefined} =>
    Object.assign.call(null, ...envKeys
        .map(key => ({[toCamelCase(key)]: env[key]}))
    );
