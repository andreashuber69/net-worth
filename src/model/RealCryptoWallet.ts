// Copyright (C) 2018-2019 Andreas Huber Dönni
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
import { ICryptoWalletProperties } from "./ICryptoWalletProperties";
import { ISerializedObject } from "./ISerializedObject";
import { QueryUtility } from "./QueryUtility";

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

        if (this.address) {
            const { result, status } = await QueryUtility.execute(() => this.queryQuantity());

            if (result !== undefined) {
                this.quantity = (this.quantity === undefined ? 0 : this.quantity) + result;
            }

            this.quantityHint = status;
        }
    }

    /** @internal */
    public toJSON(): ISerializedObject & ICryptoWalletProperties {
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
        return {
            description: props.description,
            location: props.location,
            address: props.address,
            quantity: props.quantity,
            notes: props.notes,
            currencySymbol,
            slug,
        };
    }

    /** Creates a new [[RealCryptoWallet]] instance.
     * @description If a non-empty string is passed for [[IRealCryptoWalletParameters.address]], then an attempt is made
     * to retrieve the wallet balance, which is then added to whatever is passed for
     * [[IRealCryptoWalletParameters.quantity]]. It therefore usually only makes sense to specify either address or
     * quantity, not both.
     * @param parent The parent model to which this asset belongs.
     * @param params The crypto wallet parameters.
     */
    protected constructor(parent: IModel, params: IRealCryptoWalletParameters) {
        super(parent, params.currencySymbol);
        this.description = params.description;
        this.location = params.location || "";
        this.address = params.address || "";
        this.quantity = params.quantity;
        this.notes = params.notes || "";
        this.slug = params.slug;
    }

    // tslint:disable-next-line:prefer-function-over-method
    protected queryQuantity(): Promise<number | undefined> {
        return Promise.resolve(undefined);
    }

    protected queryUnitValueUsd() {
        return this.slug ? new CoinMarketCapRequest(this.slug, false).execute() : Promise.resolve(undefined);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly slug?: string;
}
