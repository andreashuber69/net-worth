// Copyright (C) 2018-2019 Andreas Huber Dönni
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

    public readonly description = new TextInputInfo({
        label: "Description", hint: "Describes the items, e.g. 'Coins', 'Bars'.", isPresent: true, isRequired: true,
    });
    public readonly location = new TextInputInfo({
        label: "Location", hint: "The location, e.g. 'Safe', 'Safety Deposit Box'.", isPresent: true, isRequired: false,
    });
    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo({
        label: "Weight", hint: "The weight of a single item, expressed in Unit.", isPresent: true, isRequired: true,
        min: PreciousMetalAssetInputInfo.weightStep, max: undefined, step: PreciousMetalAssetInputInfo.weightStep,
    });
    public readonly weightUnit = new SelectInputInfo({
        label: "Unit", hint: "The unit Weight is expressed in.", isPresent: true, isRequired: true,
        enumType: WeightUnit, acceptStringsOnly: false,
    });
    public readonly fineness = new TextInputInfo({
        label: "Fineness", hint: "The precious metal fineness.", isPresent: true, isRequired: true,
        min: 0.5, max: 1 - PreciousMetalAssetInputInfo.finenessStep, step: PreciousMetalAssetInputInfo.finenessStep,
    });
    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo<typeof Currency>();
    public readonly quantity = new TextInputInfo({
        label: "Quantity", hint: "The number of items.", isPresent: true, isRequired: true, min: 0,
    });

    /** @internal */
    public constructor(public readonly type: PreciousMetalAssetType, ctor: IAssetConstructor) {
        super(ctor);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly weightStep = Math.pow(10, -PreciousMetalAssetInputInfo.weightDigits);
    private static readonly finenessStep = Math.pow(10, -PreciousMetalAssetInputInfo.finenessDigits);
}
