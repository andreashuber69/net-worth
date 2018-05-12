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

import { IModel } from "./Asset";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { WeightUnit } from "./WeightUnit";

/** Provides information about an asset made of silver. */
export class SilverAsset extends PreciousMetalAsset {
    /**
     * Creates a new [[SilverAsset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param description The shape of the items, e.g. 'Coins', 'Bars'.
     * @param location The location, e.g. 'Safe', 'Safety Deposit Box'.
     * @param weight The weight of a single item, expressed in `weightUnit`.
     * @param weightUnit The unit used for `weight`, e.g. [[TroyOunce]].
     * @param fineness The fineness, e.g. 0.999.
     * @param quantity The number of items.
     */
    public constructor(
        parent: IModel,
        description: string,
        location: string,
        weight: number,
        weightUnit: WeightUnit,
        fineness: number,
        quantity: number,
    ) {
        super(parent, "Silver", description, location, weight, weightUnit, fineness, quantity, "lbma/silver.json");
    }
}
