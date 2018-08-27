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
    // The high ABC is due to the number of properties that need to be assigned. Breaking this up would not improve
    // readability.
    // codebeat:disable[ABC]
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
    // codebeat:enable[ABC]

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getDescription(asset?: IAssetUnion) {
        return asset ? asset.description : "";
    }

    private static getLocation(asset?: IAssetUnion) {
        return (asset && asset.location) || "";
    }

    private static getAddress(asset?: IAssetUnion) {
        return (this.isCryptoWallet(asset) && asset.address) || "";
    }

    private static getWeight(asset?: IAssetUnion) {
        return this.isPreciousMetalAsset(asset) ? asset.weight.toString() : "";
    }

    private static getWeightUnit(asset?: IAssetUnion) {
        return this.isPreciousMetalAsset(asset) ? WeightUnit[asset.weightUnit] as keyof typeof WeightUnit : "";
    }

    private static getFineness(asset?: IAssetUnion) {
        return this.isPreciousMetalAsset(asset) ? asset.fineness.toString() : "";
    }

    private static getValue(asset?: IAssetUnion) {
        return this.isMiscAsset(asset) ? asset.value.toString() : "";
    }

    private static getValueCurrency(asset?: IAssetUnion) {
        return this.isMiscAsset(asset) ? asset.valueCurrency : "";
    }

    private static getQuantity(asset?: IAssetUnion) {
        return (asset && (!this.isCryptoWallet(asset) || !asset.address) &&
            (asset.quantity !== undefined) && asset.quantity.toString()) || "";
    }

    private static getNotes(asset?: IAssetUnion) {
        return (asset && asset.notes) || "";
    }

    private static isCryptoWallet(asset?: IAssetUnion): asset is CryptoWallet {
        return (asset && (asset.superType === CryptoWallet.superType)) || false;
    }

    private static isPreciousMetalAsset(asset?: IAssetUnion): asset is PreciousMetalAsset {
        return (asset && (asset.superType === PreciousMetalAsset.superType)) || false;
    }

    private static isMiscAsset(asset?: IAssetUnion): asset is MiscAsset {
        return (asset && (asset.superType === MiscAsset.superType)) || false;
    }
}
