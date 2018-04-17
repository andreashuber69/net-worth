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

import { AssetInfo } from "./AssetInfo";

/** Provides information about a crypto currency asset. */
export abstract class CryptoAssetInfo extends AssetInfo {
    protected static hasStringIndexer(value: any): value is { [key: string]: any } {
        return value instanceof Object;
    }

    /**
     * Creates a new [[CryptoAssetInfo]] instance.
     * @param address The public address of the crypto asset.
     * @param description Describes the crypto asset, e.g. Savings, Speculation.
     * @param currencySymbol The crypto currency symbol, e.g. BTC, LTC.
     * @param quantityDecimals The number of decimals to use to format the quantity.
     * @param cmcId The coinmarketcap.com identifier of the currency.
     */
    protected constructor(
        address: string,
        description: string,
        currencySymbol: string,
        quantity: number | undefined,
        quantityDecimals: number,
        private readonly cmcId: string,
    ) {
        super(address, description, currencySymbol, currencySymbol, quantity, quantityDecimals);
    }

    protected * getQueries() {
        yield `https://api.coinmarketcap.com/v1/ticker/${this.cmcId}/`;
    }

    protected processQueryResponse(response: any) {
        const result = this.responseProcessed;

        if (!this.responseProcessed) {
            this.responseProcessed = true;
            this.unitValue = CryptoAssetInfo.getPrice(response);
        }

        return result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getPrice(response: any) {
        return CryptoAssetInfo.isPriceInfo(response) ? Number.parseFloat(response[0].price_usd) : Number.NaN;
    }

    private static isPriceInfo(value: any): value is Array<{ price_usd: string }> {
        return this.isLengthOneObjectArray(value) && (typeof value[0].price_usd === "string");
    }

    private static isLengthOneObjectArray(value: any): value is Array<{ [key: string]: any }> {
        return this.isArray(value) && (value.length === 1) && this.hasStringIndexer(value[0]);
    }

    private static isArray(value: any): value is any[] {
        return value instanceof Array;
    }

    private responseProcessed = false;
}
