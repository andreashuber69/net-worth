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
    public get shortLocation() {
        const maxLength = 15;

        return this.location.length > maxLength ? `${this.location.substr(0, maxLength)}...` : this.location;
    }

    public formattedQuantity = "Querying...";
    public formattedValue = "Querying...";

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @internal Gets a collection of HTTP GET queries that need to be executed in order to value and optionally
     * quantify the asset.
     * @returns An iterator that points to before the first query, call `next()` to get the first query.
     */
    public abstract get queries(): IterableIterator<string>;

    /**
     * @internal Processes the response to the query that the iterator returned by [[queries]] currently points to.
     * Is called exactly once for each of the queries.
     */
    public abstract processCurrentQueryResponse(response: string): void;

    /**
     * @internal Returns the value as it has been determined by processing the responses passed to
     * [[processCurrentQueryResponse]].
     */
    public abstract getValue(): Value;

    /** @internal Calls [[getValue]] and processes the result to set [[formattedQuantity]] and [[formattedValue]]. */
    public processValue() {
        const value = this.getValue();
        this.formattedQuantity = AssetInfo.formatNumber(value.quantity, this.quantityDecimals);
        const val = AssetInfo.formatNumber(value.value, AssetInfo.getValueDecimals(value.valueCurrency));
        this.formattedValue = `${val} ${ValueCurrency[value.valueCurrency]}`;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[AssetInfo]] instance.
     * @param location The location of the asset, e.g. Saftey Deposit Box. For a crypto currency, this is the public
     * address.
     * @param description Describes the asset, e.g. Spending, Savings, Bars, Coins.
     * @param type The type of asset, e.g. Silver, Gold, BTC.
     * @param quantityDecimals The number of decimals to use to format the quantity.
     * @param quantityUnit The quantity unit, e.g. 1 oz (troy), 10 g, BTC.
     */
    protected constructor(
        public readonly location: string,
        public readonly description: string,
        public readonly type: string,
        private readonly quantityDecimals: number,
        public readonly quantityUnit: string,
    ) {
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
