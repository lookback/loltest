"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Create a parser for string arguments, often `process.argv`. */
exports.mkParseArgs = (options, format) => (argv) => {
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
    const firstIndexWithoutSwitch = argv.findIndex(a => !a.startsWith('--'));
    const argsArray = argv.slice(firstIndexWithoutSwitch);
    return Object.assign.apply(null, argv
        .map((arg) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtY2xpLWFyZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3BhcnNlLWNsaS1hcmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZUEsa0VBQWtFO0FBQ3JELFFBQUEsV0FBVyxHQUFHLENBQXFDLE9BQVUsRUFBRSxNQUFZLEVBQUUsRUFBRSxDQUN4RixDQUFDLElBQWMsRUFBZ0IsRUFBRTtJQUM3QixNQUFNLFFBQVEsR0FBNkIsRUFBRSxDQUFDO0lBRTlDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNwQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04sTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQixNQUFNLElBQUksU0FBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FDOUQ7UUFFRCw4Q0FBOEM7UUFDOUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNoQztJQUVELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ2QsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUVELE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUV0RCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJO1NBQ2hDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFO1lBQ2pDLE9BQU87Z0JBQ0gsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRzthQUN4QyxDQUFDO1NBQ0w7UUFFRCxNQUFNLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRCxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXZELElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRTtZQUNyQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEMsdUNBQXVDO1lBQ3ZDLE1BQU0sTUFBTSxHQUFHLE9BQU8sS0FBSyxPQUFPLENBQUM7WUFDbkMsNEJBQTRCO1lBQzVCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFFekMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7U0FDM0M7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUNMLENBQUM7QUFDTixDQUFDLENBQUMifQ==