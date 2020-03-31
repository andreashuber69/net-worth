// https://github.com/andreashuber69/net-worth#--
/** Thrown when a query fails. */
export class QueryError extends Error {
    public constructor(message?: string) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        super(message || "Unexpected Response");

        // eslint-disable-next-line max-len
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, QueryError.prototype);
    }
}
