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

import { IAllAssetProperties } from "./AssetInterfaces";
import { ValueInputInfo } from "./ValueInputInfo";

/** Defines a method used to validate a value. */
export interface IInputInfo {
    /**
     * Gets the [[ValueInputInfo]] subclass object for `property`.
     * @description When implemented by [[TextInputInfo]] or [[SelectInputInfo]], this method simply returns `this`.
     * @throws `Error` if `T` does not match the type implied by `property`.
     */
    getInfo<T extends ValueInputInfo>(constructor: { new(): T }, property: keyof IAllAssetProperties): T;
}
