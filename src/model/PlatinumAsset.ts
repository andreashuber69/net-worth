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
import { IPreciousMetalAssetProperties } from "./IPreciousMetalAsset";
import { PreciousMetalAsset } from "./PreciousMetalAsset";

/** Represents an asset made of platinum. */
export class PlatinumAsset extends PreciousMetalAsset {
    public readonly type = "Platinum";

    /**
     * Creates a new [[PlatinumAsset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param props The precious metal asset properties.
     */
    public constructor(parent: IModel, props: IPreciousMetalAssetProperties) {
        super(parent, props, "lppm/plat.json");
    }
}
