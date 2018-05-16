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

import { Asset, IAssetProperties } from "./Asset";
import { CoinMarketCapRequest } from "./CoinMarketCapRequest";

export interface ICryptoWalletProperties extends IAssetProperties {
    /** The public address. */
    readonly address: string;
}

export interface ICryptoWallet extends ICryptoWalletProperties {
    readonly tag: "crypto";
}

/** Provides information about a crypto currency wallet. */
export abstract class CryptoWallet extends Asset implements ICryptoWallet {
    /** The public address. */
    public readonly address: string;

    public get locationHint() {
        return this.address;
    }

    public get unit() {
        return this.currencySymbol;
    }

    public get fineness() {
        return 1;
    }

    public quantity: number | undefined;

    /** @internal */
    public get interface() {
        return this;
    }

    /** @internal */
    public readonly tag = "crypto";

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[CryptoWallet]] instance.
     * @param properties The crypto wallet properties.
     * @param currencySymbol The crypto currency symbol, e.g. 'BTC', 'LTC'.
     * @param quantityDecimals The number of decimals to use to format the quantity.
     * @param coin The coinmarketcap.com identifier of the currency.
     */
    protected constructor(
        properties: ICryptoWalletProperties,
        private readonly currencySymbol: string,
        quantityDecimals: number,
        coin: string,
    ) {
        super(properties, currencySymbol, quantityDecimals);
        this.address = properties.address;
        this.quantity = properties.quantity;
        this.queryUnitValue(coin).catch((reason) => console.error(reason));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private async queryUnitValue(coin: string) {
        this.unitValueUsd = await new CoinMarketCapRequest(coin, false).execute();
    }
}
