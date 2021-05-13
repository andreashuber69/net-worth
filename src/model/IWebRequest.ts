// https://github.com/andreashuber69/net-worth#--
/** Represents a single web request. */
export interface IWebRequest<T> {
    /** Executes the request and returns a promise for the result. */
    readonly execute: () => Promise<T>;
}
