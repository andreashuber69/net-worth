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

import { IAssetUnion } from "../model/AssetInterfaces";
import { WeightUnits } from "../model/WeightUnit";
import { IAllAssetProperties } from "./IAllAssetProperties";

/** Represents the data being edited in the asset editor. */
export class AssetEditorData implements IAllAssetProperties<string> {
    public description = "";
    public location = "";
    public address = "";
    public weight = "";
    public weightUnit = "";
    public fineness = "";
    public quantity  = "";

    /** @internal */
    public constructor(asset?: IAssetUnion) {
        if (asset) {
            this.description = asset.description;
            this.location = asset.location;

            if (asset.propertyTag === "IPreciousMetalAsset") {
                this.weight = asset.weight.toString();
                this.weightUnit = WeightUnits.toString(asset.weightUnit);
                this.fineness = asset.fineness.toString();
            } else {
                this.address = asset.address;
            }

            this.quantity = asset.quantity ? asset.quantity.toString() : "";
        }
    }
}
