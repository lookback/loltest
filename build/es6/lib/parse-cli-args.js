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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtY2xpLWFyZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3BhcnNlLWNsaS1hcmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWVBLGtFQUFrRTtBQUNsRSxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBcUMsT0FBVSxFQUFFLE1BQVksRUFBRSxFQUFFLENBQ3hGLENBQUMsSUFBYyxFQUFnQixFQUFFO0lBQzdCLE1BQU0sUUFBUSxHQUE2QixFQUFFLENBQUM7SUFFOUMsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDTixNQUFNLElBQUksU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxTQUFTLENBQUMscUNBQXFDLENBQUMsQ0FBQztTQUM5RDtRQUVELDhDQUE4QztRQUM5QyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hDO0lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDZCxPQUFPLEVBQUUsQ0FBQztLQUNiO0lBRUQsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDekUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRXRELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUk7U0FDaEMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7WUFDakMsT0FBTztnQkFDSCxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHO2FBQ3hDLENBQUM7U0FDTDtRQUVELE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFdkQsSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFO1lBQ3JCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsQyx1Q0FBdUM7WUFDdkMsTUFBTSxNQUFNLEdBQUcsT0FBTyxLQUFLLE9BQU8sQ0FBQztZQUNuQyw0QkFBNEI7WUFDNUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUV6QyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztTQUMzQztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQ0wsQ0FBQztBQUNOLENBQUMsQ0FBQyJ9