/** Create a parser for string arguments, often `process.argv`. */
export const mkParseArgs = (spec) => (argv) => {
    const handlers = {};
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
        const [argName, value] = arg.split('=');
        if (argName in handlers) {
            const handler = handlers[argName];
            // Flags have no value, treat as 'true'
            const isFlag = handler === Boolean;
            // Grab next arg in position
            const argValue = isFlag ? 'true' : value;
            return { [argName]: handler(argValue) };
        }
        return {};
    }));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtY2xpLWFyZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3BhcnNlLWNsaS1hcmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLGtFQUFrRTtBQUNsRSxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBaUIsSUFBTyxFQUFFLEVBQUUsQ0FDbkQsQ0FBQyxJQUFjLEVBQWEsRUFBRTtJQUMxQixNQUFNLFFBQVEsR0FBNkIsRUFBRSxDQUFDO0lBRTlDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNqQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04sTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1NBQzNEO1FBRUQsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQixNQUFNLElBQUksU0FBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FDOUQ7UUFFRCw4Q0FBOEM7UUFDOUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM3QjtJQUVELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ2QsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUk7U0FDaEMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNuQixNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFeEMsSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFO1lBQ3JCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsQyx1Q0FBdUM7WUFDdkMsTUFBTSxNQUFNLEdBQUcsT0FBTyxLQUFLLE9BQU8sQ0FBQztZQUNuQyw0QkFBNEI7WUFDNUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUV6QyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztTQUMzQztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQ0wsQ0FBQztBQUNOLENBQUMsQ0FBQyJ9