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
        "The shape of the items, e.g. 'Coins', 'Bars'.", true, true);
    public readonly location = new PropertyInfo(
        "The location, e.g. 'Safe', 'Safety Deposit Box'.", true, false);
    public readonly address = new PropertyInfo();
    public readonly weight = new PropertyInfo(
        "The weight of a single item, expressed in Unit.", true, true);
    public readonly weightUnit = new PropertyInfo(
        "The unit Weight is expressed in.", true, true);
    public readonly fineness = new PropertyInfo(
        "The precious metal fineness.", true, true);
    public readonly quantity = new PropertyInfo(
        "The number of items.", true, true);

    /** @internal */
    public constructor(
        public readonly type: PreciousMetalAssetTypes, quantityDecimals: number, constructor: IAssetConstructor) {
        super(quantityDecimals, constructor);
    }
}
