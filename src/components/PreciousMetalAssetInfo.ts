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

import { PreciousMetalAssetTypes } from "../model/AssetTypes";
import { AssetInfo, IAssetConstructor, IAssetInfo } from "./AssetInfo";
import { PropertyInfo } from "./PropertyInfo";

/** Defines how a precious metal asset is displayed in the asset editor UI. */
export class PreciousMetalAssetInfo extends AssetInfo implements IAssetInfo {
    public readonly description = new PropertyInfo(
        "Description", "The shape of the items, e.g. 'Coins', 'Bars'.", true, true);
    public readonly location = new PropertyInfo(
        "Location", "The location, e.g. 'Safe', 'Safety Deposit Box'.", true, false);
    public readonly address = new PropertyInfo();
    public readonly weight = new PropertyInfo(
        "Weight", "The weight of a single item, expressed in Unit.", true, true, 0, undefined, 1e-3);
    public readonly weightUnit = new PropertyInfo(
        "Unit", "The unit Weight is expressed in.", true, true);
    public readonly fineness = new PropertyInfo(
        "Fineness", "The precious metal fineness.", true, true, 0.5, 1 - 1e-6, 1e-6);
    public readonly quantity = new PropertyInfo(
        "Quantity", "The number of items.", true, true, 0);

    /** @internal */
    public constructor(
        public readonly type: PreciousMetalAssetTypes, quantityDecimals: number, constructor: IAssetConstructor) {
        super(quantityDecimals, constructor);
    }
}
