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

import { gold, palladium, platinum, silver } from "./AssetTypeName.schema";
import { IPreciousMetalAssetProperties } from "./IPreciousMetalAssetProperties.schema";

export const preciousMetalAssetTypeNames = [silver, palladium, platinum, gold] as const;

export type PreciousMetalAssetTypeName = typeof preciousMetalAssetTypeNames[number];

export interface IPreciousMetalObject {
    readonly type: PreciousMetalAssetTypeName;
}

export interface IPreciousMetalAsset extends IPreciousMetalObject, IPreciousMetalAssetProperties {
}