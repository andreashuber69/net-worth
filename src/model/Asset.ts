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
import { IAllAssetProperties, IAssetUnion, ISerializedAsset, ISerializedObject } from "./AssetInterfaces";
import { AssetTypes } from "./AssetTypes";
import { Model } from "./Model";
import { Unknown, Value } from "./Value";

/** @internal */
export interface IModel {
    readonly exchangeRate: number | undefined;
}

/** Defines the common editable properties of all assets. */
export interface IAssetProperties {
    /** Provides the asset description, e.g. 'Bars', 'Coins', 'Spending', 'Savings'. */
    readonly description: string;

    /** Provides the location of the asset, e.g. 'Safe', 'Safety Deposit Box', 'Mobile Phone', 'Hardware Wallet'. */
    readonly location: string;

    /** Provides the asset quantity. */
    readonly quantity?: number;
}

/** Defines the base of all classes that represent an asset. */
export abstract class Asset {
    public static readonly typeName = Asset.getName("type");
    public static readonly descriptionName = Asset.getName("description");
    public static readonly locationName = Asset.getName("location");
    public static readonly addressName = Asset.getName("address");
    public static readonly weightName = Asset.getName("weight");
    public static readonly weightUnitName = Asset.getName("weightUnit");
    public static readonly finenessName = Asset.getName("fineness");
    public static readonly quantityName = Asset.getName("quantity");
    public static readonly totalValueName = "totalValue";

    public static parse(model: IModel, rawAsset: Unknown | null | undefined) {
        if (!Value.hasStringProperty(rawAsset, Asset.typeName)) {
            return Value.getPropertyTypeMismatch(Asset.typeName, rawAsset, "");
        }

        const assetInfo = Model.assetInfos.find((info) => info.type === rawAsset.type);

        if (!assetInfo) {
            return Value.getUnknownValue(Asset.typeName, rawAsset.type);
        }

        const validationResult = assetInfo.validateAll(rawAsset);

        if (!this.hasProperties(validationResult, rawAsset)) {
            return validationResult;
        }

        return assetInfo.createAsset(model, rawAsset);
    }

    /** Provides the unique key of the asset. */
    public readonly key = Asset.nextKey++;

    /** Provides the parent model to which this asset belongs. */
    public readonly parent: IModel;

    public get isExpandable() {
        return false;
    }

    /** Provides the type of asset, e.g. 'Silver, 'Gold', 'Bitcoin', 'Litecoin'. */
    public abstract get type(): AssetTypes | "";

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
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static nextKey = 0;

    private static getName<T extends keyof (ISerializedObject & IAllAssetProperties)>(name: T) {
        return name;
    }

    private static hasProperties(validationResult: true | string, raw: Unknown): raw is IAllAssetProperties {
        return validationResult === true;
    }

    private static multiply(factor1: number | undefined, factor2: number | undefined) {
        return (factor1 === undefined) || (factor2 === undefined) ? undefined : factor1 * factor2;
    }
}
