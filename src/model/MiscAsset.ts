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

/* eslint-disable max-classes-per-file */
import { IParent } from "./Asset";
import { ExchangeRate } from "./ExchangeRate";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { SingleAsset } from "./SingleAsset";
import { misc } from "./validation/schemas/AssetTypeName.schema";
import { CurrencyName } from "./validation/schemas/CurrencyName.schema";
import { IMiscAsset } from "./validation/schemas/IMiscAsset.schema";
import { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties.schema";
import { Quantity0 } from "./validation/schemas/Quantity0.schema";

/** Represents a miscellaneous asset. */
export class MiscAsset extends SingleAsset {
    public static readonly type = misc;

    public readonly type = misc;

    public readonly description: string;

    public readonly location: string;

    public get unit() {
        return MiscAsset.getUnit(this.value, this.valueCurrency);
    }

    // eslint-disable-next-line class-methods-use-this
    public get fineness() {
        return undefined;
    }

    public readonly value: number;

    public readonly valueCurrency: CurrencyName;

    public readonly quantity: Quantity0;

    public readonly displayDecimals = 0;

    public readonly notes: string;

    public constructor(parent: IParent, props: IMiscAssetProperties) {
        super(parent);
        this.description = props.description;
        this.location = props.location ?? "";
        this.value = props.value;
        this.valueCurrency = props.valueCurrency;
        this.quantity = props.quantity;
        this.notes = props.notes ?? "";
    }

    /** @internal */
    public toJSON(): IMiscAsset {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public bundle(bundle?: unknown): GenericAssetBundle<MiscAsset> {
        return new MiscAsset.Bundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryUnitValueUsd() {
        return this.value / await ExchangeRate.get(this.valueCurrency);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly Bundle = class NestedBundle extends GenericAssetBundle<MiscAsset> {
        public toJSON() {
            return {
                primaryAsset: this.assets[0].toJSON(),
            };
        }
    };

    private static readonly unitFormatOptions = {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        useGrouping: true,
    };

    private static getUnit(value: number, valueCurrency: CurrencyName) {
        return `${value.toLocaleString(undefined, MiscAsset.unitFormatOptions)} ${valueCurrency}`;
    }
}

export interface IMiscAssetCtor {
    readonly type: typeof MiscAsset.type;
    new (parent: IParent, props: IMiscAssetProperties): MiscAsset;
}
