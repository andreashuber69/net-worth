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
import { CryptoWallet } from "../model/CryptoWallet";
import { Currency } from "../model/Currency";
import { IAuxProperties } from "../model/IAuxProperties";
import { MiscAsset } from "../model/MiscAsset";
import { PreciousMetalAsset } from "../model/PreciousMetalAsset";
import { WeightUnit } from "../model/WeightUnit";

/** Represents the data being edited in the asset editor. */
export class AssetEditorData implements IAuxProperties<string> {
    public description: string;
    public location: string;
    public address: string;
    public weight: string;
    public weightUnit: keyof typeof WeightUnit | "";
    public fineness: string;
    public value: string;
    public valueCurrency: keyof typeof Currency | "";
    public quantity: string;
    public notes: string;

    /** @internal */
    public constructor(asset?: IAssetUnion) {
        this.description = AssetEditorData.getDescription(asset);
        this.location = AssetEditorData.getLocation(asset);
        this.address = AssetEditorData.getAddress(asset);
        this.weight = AssetEditorData.getWeight(asset);
        this.weightUnit = AssetEditorData.getWeightUnit(asset);
        this.fineness = AssetEditorData.getFineness(asset);
        this.value = AssetEditorData.getValue(asset);
        this.valueCurrency = AssetEditorData.getValueCurrency(asset);
        this.quantity = AssetEditorData.getQuantity(asset);
        this.notes = AssetEditorData.getNotes(asset);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getDescription(asset?: IAssetUnion) {
        return asset ? asset.description : "";
    }

    private static getLocation(asset?: IAssetUnion) {
        return (asset && asset.location) || "";
    }

    private static getAddress(asset?: IAssetUnion) {
        return (asset && (asset.superType === CryptoWallet.superType) && asset.address) || "";
    }

    private static getWeight(asset?: IAssetUnion) {
        return asset && (asset.superType === PreciousMetalAsset.superType) ? asset.weight.toString() : "";
    }

    private static getWeightUnit(asset?: IAssetUnion) {
        return asset && (asset.superType === PreciousMetalAsset.superType) ?
            WeightUnit[asset.weightUnit] as keyof typeof WeightUnit : "";
    }

    private static getFineness(asset?: IAssetUnion) {
        return asset && (asset.superType === PreciousMetalAsset.superType) ? asset.fineness.toString() : "";
    }

    private static getValue(asset?: IAssetUnion) {
        return asset && (asset.superType === MiscAsset.superType) ? asset.value.toString() : "";
    }

    private static getValueCurrency(asset?: IAssetUnion) {
        return asset && (asset.superType === MiscAsset.superType) ? asset.valueCurrency : "";
    }

    private static getQuantity(asset?: IAssetUnion) {
        if (asset && ((asset.superType !== CryptoWallet.superType) || !asset.address) &&
            (asset.quantity !== undefined)) {
            return asset.quantity.toString();
        } else {
            return "";
        }
    }

    private static getNotes(asset?: IAssetUnion) {
        return (asset && asset.notes) || "";
    }
}
