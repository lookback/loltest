type Handler = (value: string) => any;

interface Spec {
    [key: string]: Handler;
}

type Argument = string;

type Result<S extends Spec, A extends Argument> = {
    [k in keyof S]?: ReturnType<S[k]>;
} &
    {
        [a in A]?: string;
    };

/** Create a parser for string arguments, often `process.argv`. */
export const mkParseArgs = <S extends Spec, A extends Argument>(
    options: S,
    format?: A[]
) => (argv: string[]): Result<S, A> => {
    const handlers: { [key: string]: Handler } = {};

    for (const key of Object.keys(options)) {
        if (!key) {
            throw new TypeError('Argument key cannot be empty string!');
        }

        if (key.length === 2) {
            throw new TypeError('Argument key must have a real name!');
        }

        // tslint:disable-next-line no-object-mutation
        handlers[key] = options[key];
    }

    if (!argv.length) {
        return {};
    }

    const firstIndexWithoutSwitch = argv.findIndex((a) => !a.startsWith('--'));
    const argsArray = argv.slice(firstIndexWithoutSwitch);

    return Object.assign.apply(
        null,
        argv.map((arg) => {
            if (!arg.startsWith('--') && format) {
                return {
                    [format[argsArray.indexOf(arg)]]: arg,
                };
            }

            const [argNameWithDashes, value] = arg.split('=');
            const argName = argNameWithDashes.replace(/^-{2}/, '');

            if (argName in handlers) {
                const handler = handlers[argName];
                // Flags have no value, treat as 'true'
                const isFlag = handler === Boolean;
                // Grab next arg in position
                const argValue = isFlag ? 'true' : value;

                return { [argName]: handler(argValue) };
            }

            return {};
        })
    );
};
