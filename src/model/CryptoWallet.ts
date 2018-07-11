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
import { cryptoWalletSuperType, ICryptoWallet, ICryptoWalletProperties } from "./ICryptoWallet";

/** Defines the base of all classes that represent a crypto currency wallet. */
export abstract class CryptoWallet extends Asset implements ICryptoWallet {
    /** @internal */
    public static readonly superType = cryptoWalletSuperType;

    public readonly address: string;

    public readonly location: string;

    public get locationHint() {
        return this.address;
    }

    public get unit() {
        return this.currencySymbol;
    }

    public get fineness() {
        return undefined;
    }

    public quantity: number | undefined;

    public readonly displayDecimals = 6;

    /** @internal */
    public get interface() {
        return this;
    }

    /** @internal */
    public readonly superType = CryptoWallet.superType;

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();

        if (this.slug) {
            this.unitValueUsd = await new CoinMarketCapRequest(this.slug, false).execute();
        }
    }

    /** @internal */
    public toJSON() {
        return {
            type: this.type,
            description: this.description,
            location: this.location || undefined,
            address: this.address || undefined,
            quantity: this.address ? undefined : this.quantity,
            notes: this.notes || undefined,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[CryptoWallet]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param properties The crypto wallet properties.
     * @param currencySymbol The crypto currency symbol, e.g. 'BTC', 'LTC'.
     * @param slug The coinmarketcap.com identifier (aka "website_slug") of the currency.
     */
    protected constructor(
        parent: IModel, properties: ICryptoWalletProperties,
        private readonly currencySymbol: string, private readonly slug?: string) {
        super(parent, properties);
        this.location = properties.location || "";
        this.address = properties.address || "";
        this.quantity = properties.quantity;
    }
}
