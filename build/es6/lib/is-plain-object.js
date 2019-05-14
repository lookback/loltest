/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObjectObject(o) {
    return o !== null && typeof o === 'object'
        && Object.prototype.toString.call(o) === '[object Object]';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtcGxhaW4tb2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9pcy1wbGFpbi1vYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFDSCxTQUFTLGNBQWMsQ0FBQyxDQUFNO0lBQzFCLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO1dBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxpQkFBaUIsQ0FBQztBQUNuRSxDQUFDO0FBRUQsTUFBTSxVQUFVLGFBQWEsQ0FBQyxDQUFNO0lBRWhDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUs7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU5Qyw4QkFBOEI7SUFDOUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUMzQixJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVU7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU3Qyw0QkFBNEI7SUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUM1QixJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFakQseURBQXlEO0lBQ3pELElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsS0FBSyxLQUFLLEVBQUU7UUFDaEQsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCw2QkFBNkI7SUFDN0IsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyJ9