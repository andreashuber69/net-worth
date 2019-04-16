
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
import { AssetType } from "./AssetTypes";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { IPreciousMetalAsset, preciousMetalSuperType } from "./IPreciousMetalAsset";
import { IPreciousMetalAssetProperties } from "./IPreciousMetalAssetProperties";
import { ISerializedObject } from "./ISerializedObject";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import { QuandlRequest } from "./QuandlRequest";
import { SingleAsset } from "./SingleAsset";
import { Unknown } from "./Unknown";
import { WeightUnit } from "./WeightUnit";

/** Defines the base of all classes that represent a precious metal asset. */
export abstract class PreciousMetalAsset extends SingleAsset implements IPreciousMetalAsset {
    /** @internal */
    public static readonly superType = preciousMetalSuperType;

    public abstract get type(): keyof typeof AssetType;

    public readonly description: string;

    public readonly location: string;

    public readonly weight: number;

    public readonly weightUnit: WeightUnit;

    public get unit() {
        return PreciousMetalAsset.getUnit(this.weight, this.weightUnit);
    }

    public readonly fineness: number;

    public readonly displayDecimals = 0;

    public readonly notes: string;

    /** @internal */
    public get interface() {
        return this;
    }

    /** @internal */
    public readonly superType = PreciousMetalAsset.superType;

    /** @internal */
    public toJSON(): ISerializedObject & IPreciousMetalAssetProperties {
        return {
            type: this.type,
            description: this.description,
            location: this.location || undefined,
            weight: this.weight,
            weightUnit: this.weightUnit,
            fineness: this.fineness,
            quantity: this.quantity,
            notes: this.notes || undefined,
        };
    }

    public abstract bundle(bundle?: Unknown): GenericAssetBundle<PreciousMetalAsset, IPreciousMetalAssetProperties>;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[PreciousMetalAsset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param props The precious metal asset properties.
     * @param quandlPath The quandl asset path.
     */
    protected constructor(parent: IModel, props: IPreciousMetalAssetProperties, private readonly quandlPath: string) {
        super(parent);
        this.description = props.description;
        this.location = props.location || "";
        this.weight = props.weight;
        this.weightUnit = props.weightUnit;
        this.fineness = props.fineness;
        this.quantity = props.quantity !== undefined ? props.quantity : Number.NaN;
        this.notes = props.notes || "";
        this.pureGramsPerUnit = this.weight * this.weightUnit * this.fineness;
    }

    protected async queryUnitValueUsd() {
        return this.pureGramsPerUnit / WeightUnit["t oz"] * await new QuandlRequest(this.quandlPath, false).execute();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly unitFormatOptions = {
        maximumFractionDigits: PreciousMetalAssetInputInfo.weightDigits, minimumFractionDigits: 0, useGrouping: true };

    private static getUnit(weight: number, unit: WeightUnit) {
        return `${weight.toLocaleString(undefined, this.unitFormatOptions)} ${WeightUnit[unit]}`;
    }

    private readonly pureGramsPerUnit: number;
}
