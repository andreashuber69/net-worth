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

import { Asset, IAssetProperties, IModel } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import { QuandlRequest } from "./QuandlRequest";
import { Unknown } from "./Value";
import { WeightUnit, WeightUnits } from "./WeightUnit";

/** Contains the defining properties common to all precious metal assets. */
export interface IPreciousMetalAssetProperties extends IAssetProperties {
    /** Provides the weight of a single item, expressed in `weightUnit`. */
    readonly weight: number;

    /** Provides the unit used for `weight`, e.g. [[TroyOunce]]. */
    readonly weightUnit: WeightUnit;

    /** Provides the fineness, e.g. 0.999. */
    readonly fineness: number;
}

/** @internal */
const superType = "Precious Metal";

/** @internal */
export interface IPreciousMetalAsset extends IPreciousMetalAssetProperties {
    /** @internal */
    readonly superType: typeof superType;
}

/** Defines the base of all classes that represent a precious metal asset. */
export abstract class PreciousMetalAsset extends Asset implements IPreciousMetalAsset {
    /** @internal */
    public static readonly superType = superType;

    public readonly weight: number;

    public readonly weightUnit: WeightUnit;

    public get unit() {
        return PreciousMetalAsset.getUnit(this.weight, this.weightUnit);
    }

    public readonly fineness: number;

    public readonly quantity: number;

    /** @internal */
    public get interface() {
        return this;
    }

    /** @internal */
    public readonly superType = PreciousMetalAsset.superType;

    /** @internal */
    public toJSON() {
        return {
            type: this.type,
            description: this.description,
            location: this.location,
            weight: this.weight,
            weightUnit: this.weightUnit,
            fineness: this.fineness,
            quantity: this.quantity,
        };
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();
        this.unitValueUsd =
            this.pureGramsPerUnit / WeightUnit.TroyOunce * await new QuandlRequest(this.quandlPath, false).execute();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[PreciousMetalAsset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param properties The precious metal asset properties.
     * @param quandlPath The quandl asset path.
     */
    protected constructor(
        parent: IModel, properties: IPreciousMetalAssetProperties, private readonly quandlPath: string) {
        super(parent, properties, 0);
        this.weight = properties.weight;
        this.weightUnit = properties.weightUnit;
        this.fineness = properties.fineness;
        this.quantity = properties.quantity !== undefined ? properties.quantity : Number.NaN;
        this.pureGramsPerUnit = this.weight * this.weightUnit * this.fineness;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly unitFormatOptions = {
        maximumFractionDigits: PreciousMetalAssetInputInfo.weightDigits, minimumFractionDigits: 0, useGrouping: true };

    private static getUnit(weight: number, unit: WeightUnit) {
        return `${weight.toLocaleString(undefined, this.unitFormatOptions)} ${WeightUnits.toString(unit)}`;
    }

    private readonly pureGramsPerUnit: number;
}
