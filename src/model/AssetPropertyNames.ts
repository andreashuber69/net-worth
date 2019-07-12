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

import { IAsset } from "./IAssetProperties";

export abstract class AssetPropertyNames {
    public static readonly type = AssetPropertyNames.getPropertyName("type");
    public static readonly description = AssetPropertyNames.getPropertyName("description");
    public static readonly location = AssetPropertyNames.getPropertyName("location");
    public static readonly notes = AssetPropertyNames.getPropertyName("notes");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getPropertyName<T extends keyof IAsset>(name: T) {
        return name;
    }
}
