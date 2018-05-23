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

import { AssetInfo } from "./AssetInfo";
import { IAssetInfo } from "./IAssetInfo";
import { SelectInfo } from "./SelectInfo";
import { TextFieldInfo } from "./TextFieldInfo";

/** Defines how the asset editor UI looks like when the asset type has not yet been selected. */
export class NoAssetInfo extends AssetInfo implements IAssetInfo {
    public readonly type = "";
    public readonly description = new TextFieldInfo();
    public readonly location = new TextFieldInfo();
    public readonly address = new TextFieldInfo();
    public readonly weight = new TextFieldInfo();
    public readonly weightUnit = new SelectInfo();
    public readonly fineness = new TextFieldInfo();
    public readonly quantity = new TextFieldInfo();

    /** @internal */
    public constructor() {
        super();
    }
}
