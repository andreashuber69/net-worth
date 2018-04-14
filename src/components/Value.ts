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

export enum ValueCurrency {
    BTC,
    USD,
}

/** @internal Encapsulates the asset properties that can be determined by querying public internet APIs. */
export class Value {
    /**
     * @internal Creates a new [[Value]] instance.
     * @param quantity The quantity of the asset. Can be `undefined` when the query was not successful.
     * @param value The value of the asset. Can be `undefined` when the query was not successful.
     * @param valueCurrency The value currency.
     */
    public constructor(
        public readonly quantity: number | undefined,
        public readonly value: number | undefined,
        public readonly valueCurrency: ValueCurrency,
    ) {
    }
}
