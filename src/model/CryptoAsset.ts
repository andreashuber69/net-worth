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
     * @param parent The parent model to which this asset belongs.
     * @param currencySymbol The crypto currency symbol, e.g. 'BTC', 'LTC'.
     * @param description The purpose of the wallet, e.g. 'Spending', 'Savings', 'Cold Storage'.
     * @param location The location of the wallet, e.g. 'Mobile Phone', 'Hardware Wallet', 'Safety Deposit Box'.
     * @param address The public address.
     * @param quantity The amount in the wallet.
     * @param quantityDecimals The number of decimals to use to format the quantity.
     * @param coin The coinmarketcap.com identifier of the currency.
     */
    protected constructor(
        parent: IModel,
        currencySymbol: string,
        description: string,
        location: string,
        address: string,
        quantity: number | undefined,
        quantityDecimals: number,
        coin: string,
    ) {
        super(parent, currencySymbol, description, location, address, currencySymbol, 1, quantity, quantityDecimals);
        this.queryUnitValue(coin).catch((reason) => console.error(reason));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private async queryUnitValue(coin: string) {
        this.unitValueUsd = await new CoinMarketCapRequest(coin, false).execute();
    }
}
