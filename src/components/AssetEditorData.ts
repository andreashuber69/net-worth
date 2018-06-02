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

import { AllAssetPropertyNames, IAssetUnion } from "../model/AssetInterfaces";
import { IAuxProperties } from "../model/IAuxProperties";
import { IEntity } from "../model/IEntity";
import { PreciousMetalAsset } from "../model/PreciousMetalAsset";
import { WeightUnits } from "../model/WeightUnit";

/** Represents the data being edited in the asset editor. */
export class AssetEditorData implements IAuxProperties<string>, IEntity {
    public description: string;
    public location: string;
    public address: string;
    public weight: string;
    public weightUnit: string;
    public fineness: string;
    public quantity: string;

    /** @internal */
    public constructor(asset?: IAssetUnion) {
        if (asset) {
            this.description = asset.description;
            this.location = asset.location;

            if (asset.superType === PreciousMetalAsset.superType) {
                this.address = "";
                this.weight = asset.weight.toString();
                this.weightUnit = WeightUnits.toString(asset.weightUnit);
                this.fineness = asset.fineness.toString();
                this.quantity = AssetEditorData.getQuantity(asset);
            } else {
                this.address = asset.address;
                this.weight = "";
                this.weightUnit = "";
                this.fineness = "";
                this.quantity = this.address ? "" : AssetEditorData.getQuantity(asset);
            }
        } else {
            this.description = "";
            this.location = "";
            this.address = "";
            this.weight = "";
            this.weightUnit = "";
            this.fineness = "";
            this.quantity  = "";
        }
    }

    public getProperty(name?: AllAssetPropertyNames) {
        if (name === undefined) {
            throw AssetEditorData.createError();
        }

        return this[name];
    }

    public setProperty(value: string, name?: AllAssetPropertyNames) {
        if (name === undefined) {
            throw AssetEditorData.createError();
        }

        this[name] = value;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getQuantity(asset: IAssetUnion) {
        return asset.quantity !== undefined ? asset.quantity.toString() : "";
    }

    private static createError() {
        return new Error("The name argument must not be undefined.");
    }
}
