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
import { ExchangeRate } from "./ExchangeRate";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { IMiscAsset, miscSuperType } from "./IMiscAsset";
import { IMiscAssetProperties } from "./IMiscAssetProperties";
import { ISerializedObject } from "./ISerializedObject";
import { MiscAssetInputInfo } from "./MiscAssetInputInfo";
import { SingleAsset } from "./SingleAsset";
import { Unknown } from "./Unknown";
import { Currency } from "./validation/schemas/Currency";

/** Represents a miscellaneous asset. */
export class MiscAsset extends SingleAsset implements IMiscAsset {
    /** @internal */
    public static readonly superType = miscSuperType;

    public readonly type  = "Misc";

    public readonly description: string;

    public readonly location: string;

    public get unit() {
        return MiscAsset.getUnit(this.value, Currency[this.valueCurrency]);
    }

    public get fineness() {
        return undefined;
    }

    public readonly value: number;

    public readonly valueCurrency: keyof typeof Currency;

    public readonly displayDecimals = 0;

    public readonly notes: string;

    /** @internal */
    public get interface() {
        return this;
    }

    /** @internal */
    public readonly superType = MiscAsset.superType;

    public constructor(parent: IModel, props: IMiscAssetProperties) {
        super(parent);
        this.description = props.description;
        this.location = props.location || "";
        this.value = props.value;
        this.valueCurrency = props.valueCurrency;
        this.quantity = props.quantity !== undefined ? props.quantity : Number.NaN;
        this.notes = props.notes || "";
    }

    /** @internal */
    public toJSON(): ISerializedObject<this["type"]> & IMiscAssetProperties {
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

    public bundle(bundle?: Unknown): GenericAssetBundle<MiscAsset, IMiscAssetProperties> {
        return new GenericAssetBundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryUnitValueUsd() {
        return this.value / await ExchangeRate.get(Currency[this.valueCurrency]);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly unitFormatOptions = {
        maximumFractionDigits: MiscAssetInputInfo.valueDigits,
        minimumFractionDigits: MiscAssetInputInfo.valueDigits,
        useGrouping: true };

    private static getUnit(value: number, valueCurrency: Currency) {
        return `${value.toLocaleString(undefined, this.unitFormatOptions)} ${Currency[valueCurrency]}`;
    }
}
