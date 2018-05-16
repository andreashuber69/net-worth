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

import { Asset, IAssetProperties } from "./Asset";
import { QuandlRequest } from "./QuandlRequest";
import { Weight, WeightUnit } from "./WeightUnit";

export interface IPreciousMetalAssetProperties extends IAssetProperties {
    readonly weight: number;
    readonly weightUnit: WeightUnit;
    readonly fineness: number;
    readonly quantity: number;
}

export interface IPreciousMetalAsset extends IPreciousMetalAssetProperties {
    readonly tag: "pm";
}

/** Provides information about an asset made of a precious metal. */
export abstract class PreciousMetalAsset extends Asset implements IPreciousMetalAsset {
    /** The weight of a single item, expressed in `weightUnit`. */
    public readonly weight: number;

    /** The unit used for `weight`, e.g. [[TroyOunce]]. */
    public readonly weightUnit: WeightUnit;

    public get unit() {
        return PreciousMetalAsset.getUnit(this.weight, this.weightUnit);
    }

    /** The fineness, e.g. 0.999. */
    public readonly fineness: number;

    public readonly quantity: number;

    public readonly tag = "pm";

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[PreciousMetalAsset]] instance.
     * @param properties The precious metal asset properties.
     * @param type The type of precious metal, e.g. 'Silver', 'Gold'.
     * @param quandlPath The quandl asset path.
     */
    protected constructor(properties: IPreciousMetalAssetProperties, type: string, quandlPath: string) {
        super(properties, type, 0);
        this.weight = properties.weight;
        this.weightUnit = properties.weightUnit;
        this.fineness = properties.fineness;
        this.quantity = properties.quantity;
        this.pureGramsPerUnit = this.weight * this.weightUnit * this.fineness;
        this.queryUnitValue(quandlPath).catch((reason) => console.error(reason));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getUnit(weight: number, unit: WeightUnit) {
        return `${weight.toFixed(0)} ${Weight.abbreviate(unit)}`;
    }

    private readonly pureGramsPerUnit: number;

    private async queryUnitValue(quandlPath: string) {
        this.unitValueUsd =
            this.pureGramsPerUnit / WeightUnit.TroyOunce * await new QuandlRequest(quandlPath, false).execute();
    }
}
