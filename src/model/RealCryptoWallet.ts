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

import { IParent } from "./Asset";
import { CryptoCompareRequest } from "./CryptoCompareRequest";
import { CryptoWallet } from "./CryptoWallet";
import { QueryUtility } from "./QueryUtility";
import { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

type SimpleCryptoWalletProperties = [
    ISimpleCryptoWalletProperties["description"],
    ISimpleCryptoWalletProperties["location"],
    IAddressCryptoWalletProperties["address"] | undefined,
    IQuantityCryptoWalletProperties["quantity"] | undefined,
    ISimpleCryptoWalletProperties["notes"]
];

export type IRealCryptoWalletParameters = ISimpleCryptoWalletProperties & {
    /** The crypto currency symbol, e.g. 'BTC', 'LTC'. */
    readonly currencySymbol: string;
};

/** Defines the base of all classes that represent a real crypto currency wallet. */
export abstract class RealCryptoWallet extends CryptoWallet {
    public readonly description: string;

    public readonly address: string;

    public readonly location: string;

    public readonly notes: string;

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // This is a hack to work around the fact that the spread operator does not call property getters:
    // https://github.com/Microsoft/TypeScript/issues/26547
    protected static getProperties(
        props: ISimpleCryptoWalletProperties, currencySymbol: string,
    ): IRealCryptoWalletParameters {
        const { description, location, notes } = props;
        const address = ("address" in props) && props.address || undefined;
        const quantity = ("quantity" in props) && props.quantity || undefined;

        return {
            ...RealCryptoWallet.getPropertiesImpl([description, location, address, quantity, notes]),
            currencySymbol,
        };
    }

    protected constructor(parent: IParent, params: IRealCryptoWalletParameters) {
        super(parent, params.currencySymbol);
        this.description = params.description;
        this.location = params.location || "";
        this.address = ("address" in params) && params.address || "";
        this.quantity = ("quantity" in params) && params.quantity || undefined;
        this.notes = params.notes || "";
    }

    // eslint-disable-next-line class-methods-use-this
    protected queryQuantity(): Promise<number | undefined> {
        return Promise.resolve(undefined);
    }

    protected queryUnitValueUsd() {
        return this.unit ? new CryptoCompareRequest(this.unit, false).execute() : Promise.resolve(undefined);
    }

    /** @internal */
    protected getProperties(): ISimpleCryptoWalletProperties {
        return RealCryptoWallet.getPropertiesImpl([
            this.description,
            this.location || undefined,
            this.address || undefined,
            this.address ? undefined : this.quantity,
            this.notes || undefined,
        ]);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getPropertiesImpl(
        [description, location, address, quantity, notes]: SimpleCryptoWalletProperties,
    ): ISimpleCryptoWalletProperties {
        if (address) {
            return { description, location, address, notes };
        } else if (quantity) {
            return { description, location, quantity, notes };
        } else {
            throw new Error("Unexpected ISimpleCryptoWalletProperties value!");
        }
    }
}
