
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
import { AssetBundle } from "./AssetBundle";
import { AssetType } from "./AssetTypes";
import { Currency } from "./Currency";
import { ExchangeRate } from "./ExchangeRate";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { GenericAssetInputInfo } from "./GenericAssetInputInfo";
import { genericSuperType, IGenericAsset, IGenericAssetProperties } from "./IGenericAsset";
import { Unknown } from "./Value";

/** Defines the base of all classes that represent a generic asset. */
export class GenericAsset extends Asset implements IGenericAsset {
    /** @internal */
    public static readonly superType = genericSuperType;

    public readonly type = AssetType.Generic;

    public readonly description: string;

    public readonly location: string;

    public get unit() {
        return GenericAsset.getUnit(this.value, Currency[this.valueCurrency]);
    }

    public get fineness() {
        return undefined;
    }

    public readonly value: number;

    public readonly valueCurrency: keyof typeof Currency;

    public readonly quantity: number;

    public readonly displayDecimals = 0;

    public readonly notes: string;

    /** @internal */
    public get interface() {
        return this;
    }

    /** @internal */
    public readonly superType = GenericAsset.superType;

    /**
     * Creates a new [[GenericAsset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param properties The generic asset properties.
     */
    public constructor(parent: IModel, properties: IGenericAssetProperties) {
        super(parent);
        this.description = properties.description;
        this.location = properties.location || "";
        this.value = properties.value;
        this.valueCurrency = properties.valueCurrency;
        this.quantity = properties.quantity !== undefined ? properties.quantity : Number.NaN;
        this.notes = properties.notes || "";
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /** @internal */
    public toJSON() {
        return {
            type: this.type,
            description: this.description,
            location: this.location || undefined,
            value: this.value,
            valueCurrency: this.valueCurrency,
            quantity: this.quantity,
            notes: this.notes || undefined,
        };
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();
        this.unitValueUsd = this.value / await ExchangeRate.get(Currency[this.valueCurrency]);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly unitFormatOptions = {
        maximumFractionDigits: GenericAssetInputInfo.valueDigits,
        minimumFractionDigits: GenericAssetInputInfo.valueDigits,
        useGrouping: true };

    private static getUnit(value: number, valueCurrency: Currency) {
        return `${value.toLocaleString(undefined, this.unitFormatOptions)} ${Currency[valueCurrency]}`;
    }
}
