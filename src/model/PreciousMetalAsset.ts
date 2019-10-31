
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
import { GenericAssetBundle } from "./GenericAssetBundle";
import { QuandlRequest } from "./QuandlRequest";
import { SingleAsset } from "./SingleAsset";
import { Unknown } from "./Unknown";
import { Fineness } from "./validation/schemas/Fineness";
import { IPreciousMetalAsset, PreciousMetalAssetTypeName } from "./validation/schemas/IPreciousMetalAsset";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties";
import { Quantity0 } from "./validation/schemas/Quantity0";
import { Weight } from "./validation/schemas/Weight";
import { WeightUnit } from "./validation/schemas/WeightUnit";

/** Defines the base of all classes that represent a precious metal asset. */
export abstract class PreciousMetalAsset extends SingleAsset {
    public abstract get type(): PreciousMetalAssetTypeName;

    public readonly description: string;

    public readonly location: string;

    public readonly weight: Weight;

    public readonly weightUnit: WeightUnit;

    public get unit() {
        return PreciousMetalAsset.getUnit(this.weight, this.weightUnit);
    }

    public readonly fineness: Fineness;

    public readonly quantity: Quantity0;

    public readonly displayDecimals = 0;

    public readonly notes: string;

    /** @internal */
    public toJSON(): IPreciousMetalAsset {
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

    public bundle(bundle?: Unknown): GenericAssetBundle<PreciousMetalAsset> {
        return new PreciousMetalAsset.Bundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[PreciousMetalAsset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param props The precious metal asset properties.
     * @param quandlPath The quandl asset path.
     */
    protected constructor(parent: IParent, props: IPreciousMetalAssetProperties, private readonly quandlPath: string) {
        super(parent);
        this.description = props.description;
        this.location = props.location || "";
        this.weight = props.weight;
        this.weightUnit = props.weightUnit;
        this.fineness = props.fineness;
        this.quantity = props.quantity;
        this.notes = props.notes || "";
        this.pureGramsPerUnit = this.weight * this.weightUnit * this.fineness;
    }

    protected async queryUnitValueUsd() {
        return this.pureGramsPerUnit / WeightUnit["t oz"] * await new QuandlRequest(this.quandlPath, false).execute();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line: max-classes-per-file variable-name
    private static readonly Bundle = class NestedBundle extends GenericAssetBundle<PreciousMetalAsset> {
        public toJSON() {
            return {
                primaryAsset: this.assets[0],
            };
        }
    };

    private static readonly unitFormatOptions = {
        maximumFractionDigits: 3, minimumFractionDigits: 0, useGrouping: true,
    };

    private static getUnit(weight: Weight, unit: WeightUnit) {
        return `${weight.toLocaleString(undefined, PreciousMetalAsset.unitFormatOptions)} ${WeightUnit[unit]}`;
    }

    private readonly pureGramsPerUnit: number;
}
