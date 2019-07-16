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

import { AssetBundle } from "./AssetBundle";
import { IAssetIntersection } from "./AssetInterfaces";
import { CalculatedAssetPropertyNames } from "./CalculatedAssetPropertyNames";
import { ICalculatedAssetProperties } from "./ICalculatedAssetProperties";
import { IOrdering } from "./Ordering";
import { QueryUtility } from "./QueryUtility";
import { Unknown } from "./Unknown";
import { AssetTypeName } from "./validation/schemas/AssetTypeName";
import { AssetUnion } from "./validation/schemas/AssetUnion";
import { Fineness } from "./validation/schemas/Fineness";
import { IAsset } from "./validation/schemas/IAssetProperties";
import { QuantityAny } from "./validation/schemas/QuantityAny";

/** @internal */
export interface IParent {
    readonly assets: {
        readonly ordering: IOrdering;
        readonly grandTotalValue?: number;
    };

    readonly exchangeRate?: number;
}

/** Defines the base of all classes that represent an asset. */
export abstract class Asset implements ICalculatedAssetProperties {
    // TODO: These should be moved into their own classes
    public static readonly addressName = Asset.getPropertyName("address");
    public static readonly weightName = Asset.getPropertyName("weight");
    public static readonly weightUnitName = Asset.getPropertyName("weightUnit");
    public static readonly finenessName = Asset.getPropertyName("fineness");
    public static readonly valueName = Asset.getPropertyName("value");
    public static readonly valueCurrencyName = Asset.getPropertyName("valueCurrency");
    public static readonly quantityName = Asset.getPropertyName("quantity");

    /** Provides the unique key of the asset. */
    public readonly key = Asset.nextKey++;

    /** Provides the parent model to which this asset belongs. */
    public readonly parent: IParent;

    public get isExpandable() {
        return false;
    }

    /** Provides the type of asset, e.g. 'Silver, 'Gold', 'Bitcoin', 'Litecoin'. */
    public abstract get type(): AssetTypeName | "";

    /** Provides the asset description, e.g. 'Bars', 'Coins', 'Spending', 'Savings'. */
    public abstract get description(): string;

    /** Provides the location of the asset, e.g. 'Safe', 'Safety Deposit Box', 'Mobile Phone', 'Hardware Wallet'. */
    public abstract get location(): string;

    /** Provides further information on the location. */
    public get locationHint() {
        return "";
    }

    /** Provides the unit of the quantity, e.g. '1 t oz', '10 g', 'BTC'. */
    public abstract get unit(): string;

    /** Provides the fineness, e.g. 0.999. For anything other than precious metals this is always undefined. */
    public abstract get fineness(): Fineness | undefined;

    /** Provides the asset quantity. */
    public abstract get quantity(): QuantityAny | undefined;

    /** Provides the quantity query error message, if applicable. */
    public abstract get quantityHint(): string;

    /** Provides the number of decimals to format the quantity to. */
    public abstract get displayDecimals(): number;

    /** Provides the asset notes. */
    public abstract get notes(): string;

    /** @internal */
    public get unitValue() {
        return Asset.multiply(this.unitValueUsd, this.parent.exchangeRate);
    }

    /** Provides the unit value query error message, if applicable. */
    public get unitValueHint() {
        return this.unitValueHintImpl;
    }

    /** @internal */
    public get totalValue() {
        return Asset.multiply(this.quantity, this.unitValue);
    }

    /** @internal */
    public get percent() {
        return (this.totalValue === undefined) || (this.parent.assets.grandTotalValue === undefined) ?
            undefined : this.totalValue / this.parent.assets.grandTotalValue * 100;
    }

    /** Provides a value indicating whether the asset has any associated actions. */
    public get hasActions() {
        return true;
    }

    /** Provides the associated asset that can be edited. */
    public get editableAsset(): Asset {
        return this;
    }

    /** @internal */
    public async queryData(): Promise<void> {
        const { result, status } = await QueryUtility.execute(() => this.queryUnitValueUsd());
        this.unitValueUsd = result;
        this.unitValueHintImpl = status;
    }

    /** @internal */
    public abstract get interface(): AssetUnion;

    /** @internal */
    public abstract toJSON(): IAsset;

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
     */
    protected constructor(parent: IParent) {
        this.parent = parent;
    }

    // tslint:disable-next-line:prefer-function-over-method
    protected queryUnitValueUsd(): Promise<number | undefined> {
        return Promise.reject(new Error("Asset cannot query unit value."));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static nextKey = 0;

    private static getPropertyName<T extends keyof IAssetIntersection>(name: T) {
        return name;
    }

    private static getCalculatedPropertyName<T extends keyof Asset>(name: T) {
        return name;
    }

    private static multiply(factor1: number | undefined, factor2: number | undefined) {
        return (factor1 === undefined) || (factor2 === undefined) ? undefined : factor1 * factor2;
    }

    private unitValueHintImpl = "";
}

export type AssetDisplayPropertyName = (keyof IAssetIntersection) |
    typeof CalculatedAssetPropertyNames.unit | typeof CalculatedAssetPropertyNames.unitValue |
    typeof CalculatedAssetPropertyNames.totalValue | typeof CalculatedAssetPropertyNames.percent;
