
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
import { IAssetBundle } from "./Asset";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { IParent } from "./IEditable";
import { QuandlRequest } from "./QuandlRequest";
import { SingleAsset } from "./SingleAsset";
import { Fineness } from "./validation/schemas/Fineness.schema";
import { IPreciousMetalAsset, PreciousMetalAssetTypeName } from "./validation/schemas/IPreciousMetalAsset.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";
import { Quantity0 } from "./validation/schemas/Quantity0.schema";
import { Weight } from "./validation/schemas/Weight.schema";
import { WeightUnit } from "./validation/schemas/WeightUnit.schema";

/** Defines the base of all classes that represent a precious metal asset. */
export abstract class PreciousMetalAsset extends SingleAsset {
    public abstract get type(): PreciousMetalAssetTypeName;

    public readonly location: string;

    public readonly description: string;

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
            location: this.location || undefined,
            description: this.description,
            weight: this.weight,
            weightUnit: this.weightUnit,
            fineness: this.fineness,
            quantity: this.quantity,
            notes: this.notes || undefined,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public bundle(bundle?: unknown): IAssetBundle {
        return new PreciousMetalAsset.Bundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(parent: IParent, props: IPreciousMetalAssetProperties, private readonly quandlPath: string) {
        super(parent);
        this.location = props.location ?? "";
        this.description = props.description;
        this.weight = props.weight;
        this.weightUnit = props.weightUnit;
        this.fineness = props.fineness;
        this.quantity = props.quantity;
        this.notes = props.notes ?? "";
        this.pureGramsPerUnit = this.weight * this.weightUnit * this.fineness;
    }

    protected async queryUnitValueUsd() {
        return this.pureGramsPerUnit / WeightUnit["t oz"] * await new QuandlRequest(this.quandlPath, false).execute();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly Bundle = class extends GenericAssetBundle<PreciousMetalAsset> implements IAssetBundle {
        public toJSON() {
            return {
                primaryAsset: this.assets[0].toJSON(),
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
