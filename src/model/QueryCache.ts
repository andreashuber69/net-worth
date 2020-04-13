// https://github.com/andreashuber69/net-worth#--
import { QueryError } from "./QueryError";
import { Validator } from "./validation/Validator";

export interface IFetchOptions<R> {
    readonly ignoreResponseCodes?: readonly number[];
    readonly getErrorMessage?: (r: R) => string | undefined;
}

/** @internal */
export class QueryCache {
    /** @internal */
    public static fetch(query: string): Promise<unknown>;
    public static fetch<R>(query: string, responseCtor: new () => R, options?: IFetchOptions<R>): Promise<R>;

    public static async fetch<R>(query: string, responseCtor?: new () => R, options: IFetchOptions<R> = {}) {
        return QueryCache.cacheResult(
            query,
            async () => (
                responseCtor ?
                    QueryCache.fetchParseValidateAndApprove(query, responseCtor, options) :
                    QueryCache.fetchAndParse(query, undefined)
            ),
        );
    }

    /** @internal */
    public static clear() {
        QueryCache.cache.clear();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly cache = new Map<string, Promise<unknown>>();

    private static async cacheResult<R>(query: string, getResponse: () => Promise<R>) {
        let result = QueryCache.cache.get(query);

        if (!result) {
            result = getResponse();
            QueryCache.cache.set(query, result);
        }

        return result;
    }

    private static async fetchParseValidateAndApprove<R>(
        query: string,
        responseCtor: new () => R,
        { ignoreResponseCodes, getErrorMessage }: IFetchOptions<R>,
    ) {
        const response = await QueryCache.fetchParseAndValidate(query, responseCtor, ignoreResponseCodes);

        if (getErrorMessage) {
            const errorMessage = getErrorMessage(response);

            if (errorMessage) {
                throw new QueryError(`Server Error: ${errorMessage}`);
            }
        }

        return response;
    }

    private static async fetchParseAndValidate<R>(
        query: string,
        responseCtor: new () => R,
        ignoreResponseCodes: readonly number[] | undefined,
    ) {
        const response = await QueryCache.fetchAndParse(query, ignoreResponseCodes);

        try {
            return Validator.fromData(response, responseCtor);
        } catch (e) {
            throw new QueryError(`Validation Error: ${e}`);
        }
    }

    private static async fetchAndParse(query: string, ignoreResponseCodes: readonly number[] | undefined) {
        const responseText = await this.tryGetText(await QueryCache.tryFetch(query), ignoreResponseCodes);

        try {
            return JSON.parse(responseText) as unknown;
        } catch (e) {
            throw new QueryError(`Invalid JSON: ${e}`);
        }
    }

    private static async tryFetch(query: string) {
        try {
            return await window.fetch(query);
        } catch (e) {
            throw new QueryError(`Network Error: ${e}`);
        }
    }

    private static async tryGetText(response: Response, ignoreResponseCodes: readonly number[] | undefined) {
        if (!response.ok && !(ignoreResponseCodes ?? []).includes(response.status)) {
            throw new QueryError(`HTTP Error: ${response.statusText}`);
        }

        try {
            return await response.text();
        } catch (e) {
            throw new QueryError(e.toString());
        }
    }
}
