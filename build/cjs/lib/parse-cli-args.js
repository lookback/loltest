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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtY2xpLWFyZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3BhcnNlLWNsaS1hcmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZUEsa0VBQWtFO0FBQ3JELFFBQUEsV0FBVyxHQUFHLENBQ3ZCLE9BQVUsRUFDVixNQUFZLEVBQ2QsRUFBRSxDQUFDLENBQUMsSUFBYyxFQUFnQixFQUFFO0lBQ2xDLE1BQU0sUUFBUSxHQUErQixFQUFFLENBQUM7SUFFaEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDTixNQUFNLElBQUksU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxTQUFTLENBQUMscUNBQXFDLENBQUMsQ0FBQztTQUM5RDtRQUVELDhDQUE4QztRQUM5QyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hDO0lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDZCxPQUFPLEVBQUUsQ0FBQztLQUNiO0lBRUQsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFFdEQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDdEIsSUFBSSxFQUNKLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sRUFBRTtZQUNqQyxPQUFPO2dCQUNILENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUc7YUFDeEMsQ0FBQztTQUNMO1FBRUQsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEQsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV2RCxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUU7WUFDckIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLHVDQUF1QztZQUN2QyxNQUFNLE1BQU0sR0FBRyxPQUFPLEtBQUssT0FBTyxDQUFDO1lBQ25DLDRCQUE0QjtZQUM1QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRXpDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1NBQzNDO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FDTCxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=