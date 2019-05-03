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

import { Asset, IModel } from "../model/Asset";
import { AssetInputInfo } from "../model/AssetInputInfo";
import { IAssetIntersection } from "../model/AssetInterfaces";
import { Currency } from "../model/Currency";
import { SelectInputInfo } from "../model/SelectInputInfo";
import { TextInputInfo } from "../model/TextInputInfo";
import { WeightUnit } from "../model/validation/schemas/WeightUnit";

/**
 * Defines how an asset with no properties needs to be "input".
 * @description This is a virtual asset that is only useful to define how the [[AssetEditor]] UI looks like when no
 * asset type has been selected yet.
 */
export class NoAssetInputInfo extends AssetInputInfo {
    public readonly type = "";
    public readonly description = new TextInputInfo();
    public readonly location = new TextInputInfo();
    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo<typeof WeightUnit>();
    public readonly fineness = new TextInputInfo();
    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo<typeof Currency>();
    public readonly quantity = new TextInputInfo();
    public readonly notes = new TextInputInfo();

    /** @internal */
    public constructor() {
        super();
    }

    // tslint:disable-next-line: prefer-function-over-method
    public createAsset(parent: IModel, props: IAssetIntersection): Asset {
        throw new Error("Can't create asset.");
    }
}
