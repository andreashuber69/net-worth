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

import { IAssetProperties } from "./IAssetProperties";
import { WeightUnit } from "./WeightUnit";

/** Contains the defining properties common to all precious metal assets. */
export interface IPreciousMetalAssetProperties extends IAssetProperties {
    /** Provides the weight of a single item, expressed in `weightUnit`. */
    readonly weight: number;
    /** Provides the unit used for `weight`, e.g. [[kg]]. */
    readonly weightUnit: WeightUnit;
    /** Provides the fineness, e.g. 0.999. */
    readonly fineness: number;
}

/** @internal */
export const preciousMetalSuperType = "Precious Metal";

/** @internal */
export interface IPreciousMetalAsset extends IPreciousMetalAssetProperties {
    /** @internal */
    readonly superType: typeof preciousMetalSuperType;
}
