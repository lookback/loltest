type Handler = (value: string) => any;

interface Spec {
    [key: string]: Handler;
}

type Result<S extends Spec> = {
    [K in keyof S]?: ReturnType<S[K]>;
};

/** Create a parser for string arguments, often `process.argv`. */
export const mkParseArgs = <S extends Spec>(spec: S) =>
    (argv: string[]): Result<S> => {
        const handlers: {[key: string]: Handler} = {};

        for (const key of Object.keys(spec)) {
            if (!key) {
                throw new TypeError('Argument key cannot be empty string!');
            }

            if (!key.startsWith('--')) {
                throw new TypeError('Argument key must start with --!');
            }

            if (key.length === 2) {
                throw new TypeError('Argument key must have a real name!');
            }

            // tslint:disable-next-line no-object-mutation
            handlers[key] = spec[key];
        }

        if (!argv.length) {
            return {};
        }

        return Object.assign.apply(null, argv
            .map((arg, idx, arr) => {
                if (arg in handlers) {
                    const handler = handlers[arg];
                    // Flags have no value, treat as 'true'
                    const isFlag = handler === Boolean;
                    // Grab next arg in position
                    const argValue = isFlag ? 'true' : argv[idx + 1];

                    return { [arg]: handler(argValue) };
                }

                return {};
            })
        );
    };
