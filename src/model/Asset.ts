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

import { IAssetUnion } from "./AssetInterfaces";
import { AssetTypes } from "./AssetTypes";

/** @internal */
export interface IModel {
    readonly exchangeRate: number | undefined;
}

/** Defines the common editable properties of all assets. */
export interface IAssetProperties {
    /** The asset description, e.g. 'Bars', 'Coins', 'Spending', 'Savings'. */
    readonly description: string;

    /** The location of the asset, e.g. 'Safe', 'Safety Deposit Box', 'Mobile Phone', 'Hardware Wallet'. */
    readonly location: string;

    /** The asset quantity. */
    readonly quantity: number | undefined;
}

/** Defines the base of all classes that represent an asset. */
export abstract class Asset {
    /** The parent model to which this asset belongs. */
    public readonly parent: IModel;

    /** The asset description, e.g. 'Bars', 'Coins', 'Spending', 'Savings'. */
    public readonly description: string;

    /** The location of the asset, e.g. 'Safe', 'Safety Deposit Box', 'Mobile Phone', 'Hardware Wallet'. */
    public readonly location: string;

    /** Further information on the location. */
    public get locationHint() {
        return "";
    }

    /** The unit of the quantity, e.g. '1 t oz', '10 g', 'BTC'. */
    public abstract get unit(): string;

    /** The fineness, e.g. 0.999. For anything other than precious metals this is always undefined. */
    public abstract get fineness(): number | undefined;

    /** The asset quantity. */
    public abstract get quantity(): number | undefined;

    /** @internal */
    public get unitValue() {
        return Asset.multiply(this.unitValueUsd, this.parent.exchangeRate);
    }

    /** @internal */
    public get totalValue() {
        return Asset.multiply(this.quantity, this.unitValue);
    }

    /** @internal */
    public abstract get interface(): IAssetUnion;

    public abstract toJSON(): { [key: string]: any } | any[];

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected unitValueUsd: number | undefined = undefined;

    /**
     * Creates a new [[Asset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param properties The asset properties.
     * @param type The type of asset, e.g. 'Silver, 'Gold', 'Bitcoin Wallet', 'Litecoin Wallet'.
     * @param quantityDecimals The number of decimals to use to format the quantity.
     */
    protected constructor(
        parent: IModel,
        properties: IAssetProperties,
        public readonly type: AssetTypes,
        public readonly quantityDecimals: number,
    ) {
        this.parent = parent;
        this.description = properties.description;
        this.location = properties.location;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static multiply(factor1: number | undefined, factor2: number | undefined) {
        return (factor1 === undefined) || (factor2 === undefined) ? undefined : factor1 * factor2;
    }
}
