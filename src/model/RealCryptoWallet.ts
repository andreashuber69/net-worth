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

import { IModel } from "./Asset";
import { CoinMarketCapRequest } from "./CoinMarketCapRequest";
import { CryptoWallet } from "./CryptoWallet";
import { ICryptoWalletProperties } from "./ICryptoWallet";

export interface IRealCryptoWalletParameters extends ICryptoWalletProperties {
    /** The crypto currency symbol, e.g. 'BTC', 'LTC'. */
    readonly currencySymbol: string;

    /** The coinmarketcap.com identifier (aka "website_slug") of the currency. */
    readonly slug?: string;
}

/** Defines the base of all classes that represent a real crypto currency wallet. */
export abstract class RealCryptoWallet extends CryptoWallet {
    public readonly description: string;

    public readonly address: string;

    public readonly location: string;

    public readonly notes: string;

    /** @internal */
    public get interface() {
        return this;
    }

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();

        if (this.slug) {
            this.unitValueUsd = await new CoinMarketCapRequest(this.slug, false).execute();
        }

        if (this.address) {
            const quantityToAdd = await this.queryQuantity();

            if (quantityToAdd !== undefined) {
                this.quantity = (this.quantity === undefined ? 0 : this.quantity) + quantityToAdd;
            }
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

    // TODO: This is a hack to work around the fact that the spread operator does not call property getters:
    // https://github.com/Microsoft/TypeScript/issues/26547
    protected static getProperties(
        props: ICryptoWalletProperties, currencySymbol: string, slug?: string): IRealCryptoWalletParameters {
        const cs = currencySymbol;
        const s = slug;

        return {
            description: props.description,
            location: props.location,
            address: props.address,
            quantity: props.quantity,
            notes: props.notes,
            currencySymbol: cs,
            slug: s,
        };
    }

    /**
     * Creates a new [[CryptoWallet]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param properties The crypto wallet properties.
     */
    protected constructor(parent: IModel, properties: IRealCryptoWalletParameters) {
        super(parent, properties.currencySymbol);
        this.description = properties.description;
        this.location = properties.location || "";
        this.address = properties.address || "";
        this.quantity = properties.quantity;
        this.notes = properties.notes || "";
        this.slug = properties.slug;
    }

    // tslint:disable-next-line:prefer-function-over-method
    protected queryQuantity(): Promise<number | undefined> {
        return Promise.resolve(undefined);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly slug?: string;
}
