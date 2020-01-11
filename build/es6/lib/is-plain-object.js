/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObjectObject(o) {
    return (o !== null &&
        typeof o === 'object' &&
        Object.prototype.toString.call(o) === '[object Object]');
}
export function isPlainObject(o) {
    if (isObjectObject(o) === false)
        return false;
    // If has modified constructor
    const ctor = o.constructor;
    if (typeof ctor !== 'function')
        return false;
    // If has modified prototype
    const prot = ctor.prototype;
    if (isObjectObject(prot) === false)
        return false;
    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
    }
    // Most likely a plain Object
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtcGxhaW4tb2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9pcy1wbGFpbi1vYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFDSCxTQUFTLGNBQWMsQ0FBQyxDQUFNO0lBQzFCLE9BQU8sQ0FDSCxDQUFDLEtBQUssSUFBSTtRQUNWLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFDckIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLGlCQUFpQixDQUMxRCxDQUFDO0FBQ04sQ0FBQztBQUVELE1BQU0sVUFBVSxhQUFhLENBQUMsQ0FBTTtJQUNoQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFOUMsOEJBQThCO0lBQzlCLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFDM0IsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFN0MsNEJBQTRCO0lBQzVCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDNUIsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRWpELHlEQUF5RDtJQUN6RCxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLEtBQUssS0FBSyxFQUFFO1FBQ2hELE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBRUQsNkJBQTZCO0lBQzdCLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMifQ==