/// <reference types="node" />
/** Parse `envKeys` from the provided env object to a dict with `envKeys` as camel cased. */
export declare const envToConf: (env: NodeJS.ProcessEnv, envKeys: string[]) => {
    [k: string]: string | undefined;
};
