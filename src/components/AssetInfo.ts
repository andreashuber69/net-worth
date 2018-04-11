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

import { Currency, Value } from "./Value";

export abstract class AssetInfo {
    public constructor(
        public readonly location: string,
        public readonly description: string,
        public readonly type: string,
        private readonly quantityDecimals: number,
        public readonly denomination: string,
        public readonly fineness?: number) {
    }

    public get shortLocation() {
        const maxLength = 15;

        return this.location.length > maxLength ? `${this.location.substr(0, maxLength)}...` : this.location;
    }

    public get formattedQuantity() {
        return !this.value ? "" : this.value.quantity.toFixed(this.quantityDecimals);
    }

    public get formattedValue() {
        if (!this.value) {
            return "";
        }

        const value =
            this.value.value ? this.value.value.toFixed(AssetInfo.getValueDecimals(this.value.valueCurrency)) : "";
        const currency = Currency[this.value.valueCurrency];

        return `${value} ${currency}`;
    }

    public initializeQueries() {
        this.iterator = this.getQueries();
        this.iteratorResult = this.iterator.next();
    }

    public get currentQuery(): string | undefined {
        if (!this.iteratorResult) {
            throw new Error("currentQuery() must not be called before initialize().");
        }

        return this.iteratorResult.value;
    }

    public abstract set currentQueryResult(result: string);

    public nextQuery() {
        if (!this.iterator) {
            throw new Error("nextQuery() must not be called before initialize().");
        }

        this.iteratorResult = this.iterator.next();

        if (this.iteratorResult.done) {
            this.value = this.getValue();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected abstract getQueries(): IterableIterator<string>;

    protected abstract getValue(): Value;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getValueDecimals(currency: Currency) {
        switch (currency) {
            case Currency.BTC:
                return 8;
            case Currency.USD:
                return 2;
            default:
                throw new Error("Unknown Currency!");
        }
    }

    private iterator?: IterableIterator<string>;
    private iteratorResult?: IteratorResult<string>;
    // tslint:disable-next-line:no-null-keyword
    private value: Value | null = null;
}
