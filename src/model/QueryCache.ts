// https://github.com/andreashuber69/net-worth#--
import { QueryError } from "./QueryError";
import { Validator } from "./validation/Validator";

/** @internal */
export class QueryCache {
    /** @internal */
    public static fetch(query: string): Promise<unknown>;
    public static fetch<R>(
        query: string,
        responseCtor: new () => R,
        getErrorMessage?: (r: R) => string | undefined,
    ): Promise<R>;

    public static async fetch<R>(
        query: string,
        responseCtor?: new () => R,
        getErrorMessage?: (r: R) => string | undefined,
    ) {
        return QueryCache.cacheResult(
            query,
            async () => (
                responseCtor ?
                    QueryCache.fetchParseValidateAndApprove(query, responseCtor, getErrorMessage) :
                    QueryCache.fetchAndParse(query)
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
        getErrorMessage?: (r: R) => string | undefined,
    ) {
        const response = await QueryCache.fetchParseAndValidate(query, responseCtor);

        if (getErrorMessage) {
            const errorMessage = getErrorMessage(response);

            if (errorMessage) {
                throw new QueryError(`Server Error: ${errorMessage}`);
            }
        }

        return response;
    }

    private static async fetchParseAndValidate<R>(query: string, responseCtor: new () => R) {
        const response = await QueryCache.fetchAndParse(query);

        try {
            return Validator.fromData(response, responseCtor);
        } catch (e) {
            throw new QueryError(`Validation Error: ${e}`);
        }
    }

    private static async fetchAndParse(query: string) {
        const responseText = await QueryCache.tryFetch(query);

        try {
            return JSON.parse(responseText) as unknown;
        } catch (e) {
            throw new QueryError(`Invalid JSON: ${e}`);
        }
    }

    private static async tryFetch(query: string) {
        try {
            return await (await window.fetch(query)).text();
        } catch (e) {
            throw new QueryError(`Network Error: ${e}`);
        }
    }
}
