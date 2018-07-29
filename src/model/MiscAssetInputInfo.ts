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
import { AssetType } from "./AssetTypes";
import { Currency } from "./Currency";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { WeightUnit } from "./WeightUnit";

/**
 * Defines how the properties of a miscellaneous asset need to be input and validated and provides a method to create a
 * representation of the asset.
 */
export class MiscAssetInputInfo extends AssetInputInfo {
    public static readonly valueDigits = 2;
    public readonly type = AssetType.Misc;
    public readonly description = new TextInputInfo(
        "Description", "The nature of the items, e.g. 'Cash', 'Vacation House'.", true, true);
    public readonly location = new TextInputInfo(
        "Location", "The location, e.g. 'Safe', 'Redford'.", true, false);
    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo<typeof WeightUnit>();
    public readonly fineness = new TextInputInfo();
    public readonly value = new TextInputInfo(
        "Value", "The value of a single item, expressed in Currency.", true, true,
        0, undefined, MiscAssetInputInfo.valueStep);
    public readonly valueCurrency = new SelectInputInfo(
        "Currency", "The currency Value is expressed in.", true, true, Currency, true);
    public readonly quantity = new TextInputInfo("Quantity", "The number of items.", true, true, 0);

    /** @internal */
    public constructor(ctor: IAssetConstructor) {
        super(ctor);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly valueStep = Math.pow(10, -MiscAssetInputInfo.valueDigits);
}
