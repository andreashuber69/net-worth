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
import { PreciousMetalAssetType } from "./AssetTypes";
import { Currency } from "./Currency";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { WeightUnit } from "./WeightUnit";

/**
 * Defines how the properties of a precious metal asset need to be input and validated and provides a method to create a
 * representation of the asset.
 */
export class PreciousMetalAssetInputInfo extends AssetInputInfo {
    public static readonly weightDigits = 3;
    public static readonly finenessDigits = 6;

    public readonly description = new TextInputInfo(
        "Description", "Describes the items, e.g. 'Coins', 'Bars'.", true, true);
    public readonly location = new TextInputInfo(
        "Location", "The location, e.g. 'Safe', 'Safety Deposit Box'.", true, false);
    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo(
        "Weight", "The weight of a single item, expressed in Unit.", true, true,
        PreciousMetalAssetInputInfo.weightStep, undefined, PreciousMetalAssetInputInfo.weightStep);
    public readonly weightUnit = new SelectInputInfo(
        "Unit", "The unit Weight is expressed in.", true, true, WeightUnit);
    public readonly fineness = new TextInputInfo(
        "Fineness", "The precious metal fineness.", true, true,
        0.5, 1 - PreciousMetalAssetInputInfo.finenessStep, PreciousMetalAssetInputInfo.finenessStep);
    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo<typeof Currency>();
    public readonly quantity = new TextInputInfo("Quantity", "The number of items.", true, true, 0);

    /** @internal */
    public constructor(public readonly type: PreciousMetalAssetType, ctor: IAssetConstructor) {
        super(ctor);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly weightStep = Math.pow(10, -PreciousMetalAssetInputInfo.weightDigits);
    private static readonly finenessStep = Math.pow(10, -PreciousMetalAssetInputInfo.finenessDigits);
}
