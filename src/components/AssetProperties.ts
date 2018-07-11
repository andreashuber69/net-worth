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

import { IAssetIntersection } from "../model/AssetInterfaces";
import { WeightUnits } from "../model/WeightUnit";
import { AssetEditorData } from "./AssetEditorData";

/**
 * Converts the data edited in the editor into the format necessary to construct [[Asset]] subclass objects.
 */
export class AssetProperties implements IAssetIntersection {
    public get description() {
        return this.data.description;
    }

    public get location() {
        return this.data.location;
    }

    public get address() {
        return this.data.address || undefined;
    }

    public get weight() {
        return Number.parseFloat(this.data.weight);
    }

    public get weightUnit() {
        return WeightUnits.toWeightUnit(this.data.weightUnit);
    }

    public get fineness() {
        return Number.parseFloat(this.data.fineness);
    }

    public get quantity() {
        return this.data.quantity ? Number.parseFloat(this.data.quantity) : undefined;
    }

    public get notes() {
        return this.data.notes;
    }

    /** @internal */
    public constructor(private readonly data: AssetEditorData) {
    }
}
