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
import { PreciousMetalAsset, WeigthUnit } from "./PreciousMetalAsset";

/** Provides information about an asset made of silver. */
export class SilverInfo extends PreciousMetalAsset {
    /**
     * Creates a new [[SilverInfo]] instance.
     * @param model The model to which this asset belongs.
     * @param location The location of the silver, e.g. Saftey Deposit Box or Home Safe.
     * @param description Describes the silver items, e.g. Bars, Coins, Medallions.
     * @param weightUnit The unit used for `weight`, e.g. [[TroyOunce]].
     * @param weight The weight of a single item, expressed in `weightUnit`.
     * @param fineness The fineness, e.g. 0.999.
     * @param quantity The number of items.
     */
    public constructor(
        model: IModel,
        location: string,
        description: string,
        weightUnit: WeigthUnit,
        weight: number,
        fineness: number,
        quantity: number,
    ) {
        super(model, location, description, "Silver", weightUnit, weight, fineness, quantity, "silver");
    }
}
