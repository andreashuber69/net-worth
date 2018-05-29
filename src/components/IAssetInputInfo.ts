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

import { Asset, IModel } from "../model/Asset";
import { IAllAssetProperties } from "../model/AssetInterfaces";
import { AssetTypes } from "../model/AssetTypes";
import { IAuxProperties } from "./IAuxProperties";
import { ValueInputInfo } from "./ValueInputInfo";

/**
 * For an asset of a given type, defines how its properties need to be input and provides a method to create the
 * asset.
 */
export interface IAssetInputInfo extends IAuxProperties<ValueInputInfo> {
    readonly type: "" | AssetTypes;

    /** @internal */
    createAsset(parent: IModel, properties: IAllAssetProperties): Asset;
}
