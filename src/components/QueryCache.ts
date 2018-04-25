// Copyright (C) 2018 Andreas Huber Dönni
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

export class QueryCache {
    public static async fetch(query: string) {
        const cached = this.cache.get(query);

        return cached ? cached : this.fetchAndParse(query);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly cache = new Map<string, any>();

    private static async fetchAndParse(query: string) {
        try {
            const result = JSON.parse(await (await window.fetch(query)).text());
            this.cache.set(query, result);

            return result;
        } catch {
            // It appears that after catch (e), e is sometimes undefined at this point, which is why we go with plain
            // catch.
            return { error: "Can't fetch or parse response." };
        }
    }
}
