/** Create a parser for string arguments, often `process.argv`. */
export const mkParseArgs = (options, format) => (argv) => {
    const handlers = {};
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
    return Object.assign.apply(null, argv.map((arg) => {
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
    }));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtY2xpLWFyZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3BhcnNlLWNsaS1hcmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWVBLGtFQUFrRTtBQUNsRSxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FDdkIsT0FBVSxFQUNWLE1BQVksRUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFjLEVBQWdCLEVBQUU7SUFDbEMsTUFBTSxRQUFRLEdBQStCLEVBQUUsQ0FBQztJQUVoRCxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLE1BQU0sSUFBSSxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUMvRDtRQUVELElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1NBQzlEO1FBRUQsOENBQThDO1FBQzlDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEM7SUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNkLE9BQU8sRUFBRSxDQUFDO0tBQ2I7SUFFRCxNQUFNLHVCQUF1QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUV0RCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUN0QixJQUFJLEVBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFO1lBQ2pDLE9BQU87Z0JBQ0gsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRzthQUN4QyxDQUFDO1NBQ0w7UUFFRCxNQUFNLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRCxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXZELElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTtZQUNyQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEMsdUNBQXVDO1lBQ3ZDLE1BQU0sTUFBTSxHQUFHLE9BQU8sS0FBSyxPQUFPLENBQUM7WUFDbkMsNEJBQTRCO1lBQzVCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFFekMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7U0FDM0M7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUNMLENBQUM7QUFDTixDQUFDLENBQUMifQ==