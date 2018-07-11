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

import { AssetBundle } from "./AssetBundle";
import {
    IAssetIntersection, IAssetUnion, ISerializedAsset, ISerializedObject, SerializedAssetPropertyName,
} from "./AssetInterfaces";

import { AssetType } from "./AssetTypes";
import { IAssetProperties } from "./IAssetProperties";
import { Unknown } from "./Value";

/** @internal */
export interface IModel {
    readonly groupBy: GroupBy;
    readonly exchangeRate: number | undefined;
}

/** Defines the base of all classes that represent an asset. */
export abstract class Asset {
    public static readonly typeName = Asset.getPropertyName("type");
    public static readonly descriptionName = Asset.getPropertyName("description");
    public static readonly locationName = Asset.getPropertyName("location");
    public static readonly addressName = Asset.getPropertyName("address");
    public static readonly unitName = Asset.getCalculatedPropertyName("unit");
    public static readonly weightName = Asset.getPropertyName("weight");
    public static readonly weightUnitName = Asset.getPropertyName("weightUnit");
    public static readonly finenessName = Asset.getPropertyName("fineness");
    public static readonly unitValueName = Asset.getCalculatedPropertyName("unitValue");
    public static readonly quantityName = Asset.getPropertyName("quantity");
    public static readonly notesName = Asset.getPropertyName("notes");
    public static readonly totalValueName = Asset.getCalculatedPropertyName("totalValue");

    /** Provides the unique key of the asset. */
    public readonly key = Asset.nextKey++;

    /** Provides the parent model to which this asset belongs. */
    public readonly parent: IModel;

    public get isExpandable() {
        return false;
    }

    /** Provides the type of asset, e.g. 'Silver, 'Gold', 'Bitcoin', 'Litecoin'. */
    public abstract get type(): AssetType | "";

    /** Provides the asset description, e.g. 'Bars', 'Coins', 'Spending', 'Savings'. */
    public readonly description: string;

    /** Provides the location of the asset, e.g. 'Safe', 'Safety Deposit Box', 'Mobile Phone', 'Hardware Wallet'. */
    public abstract get location(): string;

    /** Provides further information on the location. */
    public get locationHint() {
        return "";
    }

    /** Provides the unit of the quantity, e.g. '1 t oz', '10 g', 'BTC'. */
    public abstract get unit(): string;

    /** Provides the fineness, e.g. 0.999. For anything other than precious metals this is always undefined. */
    public abstract get fineness(): number | undefined;

    /** Provides the asset quantity. */
    public abstract get quantity(): number | undefined;

    /** Provides the asset notes. */
    public readonly notes: string;

    /** Provides the number of decimals to format the quantity to. */
    public abstract get displayDecimals(): number;

    /** @internal */
    public get unitValue() {
        return Asset.multiply(this.unitValueUsd, this.parent.exchangeRate);
    }

    /** @internal */
    public get totalValue() {
        return Asset.multiply(this.quantity, this.unitValue);
    }

    /** Provides a value indicating whether the asset has any associated actions. */
    public get hasActions() {
        return true;
    }

    /** Provides a value indicating whether the asset can be edited. */
    public get isEditable() {
        return true;
    }

    /** @internal */
    // tslint:disable-next-line:no-empty prefer-function-over-method
    public async queryData(): Promise<void> {
    }

    /** @internal */
    public abstract get interface(): IAssetUnion;

    /** @internal */
    public abstract toJSON(): ISerializedAsset;

    /** @internal */
    // tslint:disable-next-line:prefer-function-over-method
    public bundle(bundle?: Unknown): AssetBundle {
        throw new Error("Asset cannot be bundled.");
    }

    /** @internal */
    // tslint:disable-next-line:no-empty prefer-function-over-method
    public expand() {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected unitValueUsd: number | undefined = undefined;

    /**
     * Creates a new [[Asset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param properties The asset properties.
     */
    protected constructor(parent: IModel, properties: IAssetProperties) {
        this.parent = parent;
        this.description = properties.description;
        this.notes = properties.notes || "";
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static nextKey = 0;

    private static getPropertyName<T extends keyof (ISerializedObject & IAssetIntersection)>(name: T) {
        return name;
    }

    private static getCalculatedPropertyName<T extends keyof Asset>(name: T) {
        return name;
    }

    private static multiply(factor1: number | undefined, factor2: number | undefined) {
        return (factor1 === undefined) || (factor2 === undefined) ? undefined : factor1 * factor2;
    }
}

export type GroupBy = typeof Asset.typeName | typeof Asset.locationName;

export type AssetDisplayPropertyName =
    SerializedAssetPropertyName | typeof Asset.unitName | typeof Asset.unitValueName | typeof Asset.totalValueName;
