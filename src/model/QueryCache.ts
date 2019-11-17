// Copyright (C) 2018-2019 Andreas Huber Dönni
//
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
// License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program. If not, see
// <http://www.gnu.org/licenses/>.

import { QueryError } from "./QueryError";
import { Unknown } from "./Unknown";
import { Validator } from "./validation/Validator";

/** @internal */
export class QueryCache {
    // TODO: Check whether extends object constraint is necessary
    /** @internal */
    public static fetch(query: string): Promise<Unknown | null>;
    public static fetch<R extends object>(query: string, responseCtor: new () => R): Promise<R>;
    public static async fetch<R extends object>(query: string, responseCtor?: new () => R) {
        return responseCtor ?
            QueryCache.cacheResult(query, () => QueryCache.fetchParseAndValidate(query, responseCtor)) :
            QueryCache.cacheResult(query, () => QueryCache.fetchAndParse(query));
    }

    /** @internal */
    public static clear() {
        QueryCache.cache.clear();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly cache = new Map<string, Promise<Unknown | null>>();

    private static cacheResult<R extends Unknown | null>(query: string, getResponse: () => Promise<R>) {
        let result = QueryCache.cache.get(query);

        if (!result) {
            result = getResponse();
            QueryCache.cache.set(query, result);
        }

        return result;
    }

    private static async fetchParseAndValidate<R extends object>(query: string, responseCtor: new () => R) {
        const response = await QueryCache.fetchAndParse(query);

        try {
            return Validator.fromData(response, responseCtor);
        } catch (e) {
            throw new QueryError(`Validation Error: ${e}`);
        }
    }

    private static async fetchAndParse(query: string) {
        let responseText: string;

        try {
            responseText = await (await window.fetch(query)).text();
        } catch (e) {
            throw new QueryError(`Network Error: ${e}`);
        }

        try {
            return JSON.parse(responseText) as Unknown | null;
        } catch (e) {
            throw new QueryError(`Invalid JSON: ${e}`);
        }
    }
}
