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

type IProperties<T> = { [K in keyof IAssetPropertiesIntersection]: T };

export class Properties<T> implements IProperties<T> {
    public readonly description: T;
    public readonly location: T;
    public readonly address: T;
    public readonly weight: T;
    public readonly weightUnit: T;
    public readonly fineness: T;
    public readonly quantity: T;

    /** Creates a new [[Properties]] instance. */
    public constructor(description: T, location: T, address: T, weight: T, weightUnit: T, fineness: T, quantity: T) {
        this.description = description;
        this.location = location;
        this.address = address;
        this.weight = weight;
        this.weightUnit = weightUnit;
        this.fineness = fineness;
        this.quantity = quantity;
    }
}
