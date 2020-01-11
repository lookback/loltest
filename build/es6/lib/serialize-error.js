const isPrimitive = (val) => ['number', 'string', 'boolean'].includes(typeof val);
/** Serialize and Error to a plain object, keeping commonly used properties. */
export const serializeError = (err, props) => Object.assign.apply(null, ['name', 'message', 'stack', 'code']
    .concat(props || [])
    // Filter out unwanted
    .filter((k) => isPrimitive(err[k]))
    // Create new object array and spread the array on the return object
    .map((k) => ({ [k]: err[k] })));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplLWVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zZXJpYWxpemUtZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUM3QixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFFekQsK0VBQStFO0FBQy9FLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUMxQixHQUFVLEVBQ1YsS0FBZ0IsRUFDZixFQUFFLENBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2YsSUFBSSxFQUNKLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0tBQy9CLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0lBQ3BCLHNCQUFzQjtLQUNyQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBRSxHQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxvRUFBb0U7S0FDbkUsR0FBRyxDQUFDLENBQUMsQ0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ2xELENBQUMifQ==