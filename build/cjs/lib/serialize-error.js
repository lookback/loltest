"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isPrimitive = (val) => ['number', 'string', 'boolean'].includes(typeof val);
/** Serialize and Error to a plain object, keeping commonly used properties. */
exports.serializeError = (err, props) => Object.assign.apply(null, (['name', 'message', 'stack', 'code'].concat(props || [])
    // Filter out unwanted
    .filter(k => isPrimitive(err[k]))
    // Create new object array and spread the array on the return object
    .map((k) => ({ [k]: err[k] }))));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplLWVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zZXJpYWxpemUtZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQzdCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUV6RCwrRUFBK0U7QUFDbEUsUUFBQSxjQUFjLEdBQUcsQ0FBNEIsR0FBVSxFQUFFLEtBQWdCLEVBQUssRUFBRSxDQUN6RixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0lBQy9FLHNCQUFzQjtLQUNyQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUUsR0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsb0VBQW9FO0tBQ25FLEdBQUcsQ0FBQyxDQUFDLENBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQy9DLENBQUMifQ==