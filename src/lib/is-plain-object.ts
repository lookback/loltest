/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObjectObject(o: any): boolean {
    return o !== null && typeof o === 'object' && Object.prototype.toString.call(o) === '[object Object]';
}

export function isPlainObject(o: any): boolean {
    if (isObjectObject(o) === false) return false;

    // If has modified constructor
    const ctor = o.constructor;
    if (typeof ctor !== 'function') return false;

    // If has modified prototype
    const prot = ctor.prototype;
    if (isObjectObject(prot) === false) return false;

    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
    }

    // Most likely a plain Object
    return true;
}
