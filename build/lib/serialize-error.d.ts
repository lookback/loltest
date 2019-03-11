export interface SerializedError {
    message: string;
    name: string;
    stack?: string;
    code?: string;
}
/** Serialize and Error to a plain object, keeping commonly used properties. */
export declare const serializeError: <T extends SerializedError>(err: Error, props?: string[] | undefined) => T;
