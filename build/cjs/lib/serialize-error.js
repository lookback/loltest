"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isPrimitive = (val) => ['number', 'string', 'boolean'].includes(typeof val);
/** Serialize and Error to a plain object, keeping commonly used properties. */
exports.serializeError = (err, props) => Object.assign.apply(null, ['name', 'message', 'stack', 'code']
    .concat(props || [])
    // Filter out unwanted
    .filter((k) => isPrimitive(err[k]))
    // Create new object array and spread the array on the return object
    .map((k) => ({ [k]: err[k] })));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplLWVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zZXJpYWxpemUtZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQzdCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUV6RCwrRUFBK0U7QUFDbEUsUUFBQSxjQUFjLEdBQUcsQ0FDMUIsR0FBVSxFQUNWLEtBQWdCLEVBQ2YsRUFBRSxDQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUNmLElBQUksRUFDSixDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztLQUMvQixNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUNwQixzQkFBc0I7S0FDckIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUUsR0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsb0VBQW9FO0tBQ25FLEdBQUcsQ0FBQyxDQUFDLENBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNsRCxDQUFDIn0=