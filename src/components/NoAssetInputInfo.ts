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

import { AssetInputInfo } from "../model/AssetInputInfo";
import { IAssetInputInfo } from "../model/IAssetInputInfo";
import { SelectInputInfo } from "../model/SelectInputInfo";
import { TextInputInfo } from "../model/TextInputInfo";

/**
 * Defines how an asset with no properties needs to be "input".
 * @description This is a virtual asset that is only useful to define how the [[AssetEditor]] UI looks like when no
 * asset type has been selected yet.
 */
export class NoAssetInputInfo extends AssetInputInfo implements IAssetInputInfo {
    public readonly type = "";
    public readonly description = new TextInputInfo();
    public readonly location = new TextInputInfo();
    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo();
    public readonly fineness = new TextInputInfo();
    public readonly quantity = new TextInputInfo();

    /** @internal */
    public constructor() {
        super();
    }
}
