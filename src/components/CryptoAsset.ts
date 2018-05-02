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

import { Asset, IModel } from "./Asset";
import { CoinMarketCapRequest } from "./CoinMarketCapRequest";

/** Provides information about a crypto currency asset. */
export abstract class CryptoAsset extends Asset {
    /**
     * Creates a new [[CryptoAsset]] instance.
     * @param model The model to which this asset belongs.
     * @param address The public address of the crypto asset.
     * @param description Describes the crypto asset, e.g. Savings, Speculation.
     * @param currencySymbol The crypto currency symbol, e.g. BTC, LTC.
     * @param quantity The amount of crypto currency.
     * @param quantityDecimals The number of decimals to use to format the quantity.
     * @param coin The coinmarketcap.com identifier of the currency.
     */
    protected constructor(
        model: IModel,
        address: string,
        description: string,
        currencySymbol: string,
        quantity: number | undefined,
        quantityDecimals: number,
        private readonly coin: string,
    ) {
        super(model, address, description, currencySymbol, currencySymbol, 1, quantity, quantityDecimals);
        this.queryUnitValue().catch((reason) => console.error(reason));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private async queryUnitValue() {
        this.unitValueUsd = await new CoinMarketCapRequest(this.coin, false).execute();
    }
}
