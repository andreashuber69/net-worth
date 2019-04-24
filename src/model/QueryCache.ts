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

import { Query } from "./Query";
import { QueryError } from "./QueryError";
import { Unknown } from "./Unknown";
import { Validator } from "./validation/Validator";

/** @internal */
export class QueryCache {
    /** @internal */
    public static fetch(query: string): Promise<Unknown | null>;
    public static fetch<R extends object>(query: Query<R>): Promise<R>;
    public static async fetch<R extends object>(query: string | Query<R>) {
        return (typeof query === "string") ?
            this.cacheResult(query, () => this.fetchAndParse(query)) :
            this.cacheResult(query.url, () => this.fetchParseAndValidate(query));
    }

    /** @internal */
    public static clear() {
        this.cache.clear();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly cache = new Map<string, Promise<Unknown | null>>();

    private static cacheResult<R extends Unknown | null>(query: string, getResponse: () => Promise<R>) {
        let result = this.cache.get(query);

        if (!result) {
            result = getResponse();
            this.cache.set(query, result);
        }

        return result;
    }

    private static async fetchParseAndValidate<R extends object>(query: Query<R>) {
        const response = await this.fetchAndParse(query.url);

        try {
            return Validator.fromData(response, query.responseCtor);
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
