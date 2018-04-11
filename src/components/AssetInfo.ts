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
    public formattedQuantity = "Querying...";
    public formattedValue = "Querying...";

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

    public abstract get queries(): IterableIterator<string>;

    public abstract set currentQueryResponse(result: string);

    public abstract finalize(): Value;

    public processResult() {
        const value = this.finalize();
        this.formattedQuantity = value.quantity.toFixed(this.quantityDecimals);
        const val = value.value !== undefined ?
            value.value.toFixed(AssetInfo.getValueDecimals(value.valueCurrency)) : "";
        const currency = Currency[value.valueCurrency];
        this.formattedValue = `${val} ${currency}`;
    }

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
}
