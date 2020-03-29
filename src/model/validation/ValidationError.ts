// https://github.com/andreashuber69/net-worth#--
export class ValidationError extends Error {
    public constructor(message?: string) {
        super(message);

        // eslint-disable-next-line max-len
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
