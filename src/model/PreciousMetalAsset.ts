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
import { QuandlRequest } from "./QuandlRequest";
import { Weight, WeightUnit } from "./WeightUnit";

/** Provides information about an asset made of a precious metal. */
export abstract class PreciousMetalAsset extends Asset {
    public get unit() {
        return PreciousMetalAsset.getUnit(this.weight, this.weightUnit);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[PreciousMetalAsset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param type The type of precious metal, e.g. 'Silver', 'Gold'.
     * @param description The shape of the items, e.g. 'Coins', 'Bars'.
     * @param location The location, e.g. 'Safe', 'Safety Deposit Box'.
     * @param weight The weight of a single item, expressed in `weightUnit`.
     * @param weightUnit The unit used for `weight`, e.g. [[TroyOunce]].
     * @param fineness The fineness, e.g. 0.999.
     * @param quantity The number of items.
     * @param quandlPath The quandl asset path.
     */
    protected constructor(
        parent: IModel,
        type: string,
        description: string,
        location: string,
        private readonly weight: number,
        private readonly weightUnit: WeightUnit,
        fineness: number,
        public readonly quantity: number,
        quandlPath: string,
    ) {
        super(parent, type, description, location, fineness, 0);
        this.pureGramsPerUnit = weight * weightUnit * fineness;
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
