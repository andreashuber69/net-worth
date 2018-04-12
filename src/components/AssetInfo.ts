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

import { Value, ValueCurrency } from "./Value";

/** Base of all classes that provide information about an asset. */
export abstract class AssetInfo {
    public formattedQuantity = "Querying...";
    public formattedValue = "Querying...";

    public get shortLocation() {
        const maxLength = 15;

        return this.location.length > maxLength ? `${this.location.substr(0, maxLength)}...` : this.location;
    }

    /** @internal
     * @description Provides a collection of HTTP GET queries that need to be executed in order to value and optionally
     * quantify the asset.
     * @returns An iterator that points to before the first query, call @see IterableIterator<string>.next() to get the
     * first query.
     */
    public abstract get queries(): IterableIterator<string>;

    /** @internal
     * @description Processes the response to the query that the iterator returned by @see queries currently points to.
     * Is called exactly once for each of the queries.
     */
    public abstract processCurrentQueryResponse(response: string): void;

    /** @internal
     * @description Returns the value as it has been determined by processing the responses passed to
     * @see processCurrentQueryResponse
     */
    public abstract getValue(): Value;

    /** @internal */
    public processValue() {
        const value = this.getValue();
        this.formattedQuantity = AssetInfo.formatNumber(value.quantity, this.quantityDecimals);
        const val = AssetInfo.formatNumber(value.value, AssetInfo.getValueDecimals(value.valueCurrency));
        this.formattedValue = `${val} ${ValueCurrency[value.valueCurrency]}`;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(
        public readonly location: string,
        public readonly description: string,
        public readonly type: string,
        private readonly quantityDecimals: number,
        public readonly denomination: string,
        public readonly fineness?: number) {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static formatNumber(num: number | undefined, decimals: number) {
        return num !== undefined ? num.toFixed(decimals) : "Error";
    }

    private static getValueDecimals(currency: ValueCurrency) {
        switch (currency) {
            case ValueCurrency.BTC:
                return 8;
            case ValueCurrency.USD:
                return 2;
            default:
                throw new Error("Unknown Currency!");
        }
    }
}
