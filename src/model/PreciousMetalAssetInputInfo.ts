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

import { AssetInputInfo, IAssetConstructor } from "./AssetInputInfo";
import { PreciousMetalAssetTypes } from "./AssetTypes";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { WeightUnits } from "./WeightUnit";

/**
 * Defines how the properties of a precious metal asset need to be input and provides a method to create a
 * representation of the asset.
 */
export class PreciousMetalAssetInputInfo extends AssetInputInfo {
    public readonly description = new TextInputInfo(
        "Description", "The shape of the items, e.g. 'Coins', 'Bars'.", true, true);
    public readonly location = new TextInputInfo(
        "Location", "The location, e.g. 'Safe', 'Safety Deposit Box'.", true, false);
    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo(
        "Weight", "The weight of a single item, expressed in Unit.", true, true, 1e-3, undefined, 1e-3);
    public readonly weightUnit = new SelectInputInfo(
        "Unit", "The unit Weight is expressed in.", true, true, Array.from(WeightUnits.getAllStrings()));
    public readonly fineness = new TextInputInfo(
        "Fineness", "The precious metal fineness.", true, true, 0.5, 1 - 1e-6, 1e-6);
    public readonly quantity = new TextInputInfo("Quantity", "The number of items.", true, true, 0);

    /** @internal */
    public constructor(public readonly type: PreciousMetalAssetTypes, ctor: IAssetConstructor) {
        super(ctor);
    }
}
