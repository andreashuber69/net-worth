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

/** @internal */
export class QueryCache {
    /** @internal */
    public static fetch(query: string) {
        let result = this.cache.get(query);

        if (!result) {
            result = this.fetchImpl(query);
            this.cache.set(query, result);
        }

        return result;
    }

    /** @internal */
    public static clear() {
        this.cache.clear();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly cache = new Map<string, Promise<Unknown | null>>();

    private static async fetchImpl(query: string) {
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
