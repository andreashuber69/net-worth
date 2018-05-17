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

import { IAssetPropertiesIntersection } from "../model/AssetInterfaces";

type IEditableProperties = { [K in keyof IAssetPropertiesIntersection]: boolean };

export class EditableProperties implements IEditableProperties {
    public readonly address: boolean;
    public readonly description: boolean;
    public readonly location: boolean;
    public readonly quantity: boolean;
    public readonly weight: boolean;
    public readonly weightUnit: boolean;
    public readonly fineness: boolean;

    public constructor(
        address: boolean, description: boolean, location: boolean,
        quantity: boolean, weight: boolean, weightUnit: boolean, fineness: boolean) {
        this.address = address;
        this.description = description;
        this.location = location;
        this.quantity = quantity;
        this.weight = weight;
        this. weightUnit = weightUnit;
        this. fineness = fineness;
    }
}
