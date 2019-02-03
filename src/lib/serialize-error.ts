export interface SerializedError {
    message: string;
    name: string;
    stack?: string;
    code?: string;
}

const isPrimitive = (val: any) =>
    ['number', 'string', 'boolean'].includes(typeof val);

/** Serialize and Error to a plain object, keeping commonly used properties. */
export const serializeError = <T extends SerializedError>(err: Error, props?: string[]): T =>
    Object.assign.apply(null, (['name', 'message', 'stack', 'code'].concat(props || [])
        // Filter out unwanted
        .filter(k => isPrimitive((err as any)[k]))
        // Create new object array and spread the array on the return object
        .map((k: keyof Error) => ({ [k]: err[k] })))
    );
