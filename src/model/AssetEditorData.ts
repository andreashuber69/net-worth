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

import { IAuxProperties } from "./IAuxProperties";
import { ObjectConverter } from "./TaggedObjectConverter";
import { AssetTypeName } from "./validation/schemas/AssetTypeName";
import { AssetUnion } from "./validation/schemas/AssetUnion";
import { CurrencyName } from "./validation/schemas/CurrencyName";
import { erc20TokensWalletTypeNames, IErc20TokensWallet } from "./validation/schemas/IErc20TokensWallet";
import { IMiscAsset, miscAssetTypeNames } from "./validation/schemas/IMiscAsset";
import { IPreciousMetalAsset, preciousMetalAssetTypeNames } from "./validation/schemas/IPreciousMetalAsset";
import { ISimpleCryptoWallet, simpleCryptoWalletTypeNames } from "./validation/schemas/ISimpleCryptoWallet";
import { WeightUnit } from "./validation/schemas/WeightUnit";
import { WeightUnitName } from "./validation/schemas/WeightUnitName";

/** Represents the data being edited in the asset editor. */
export class AssetEditorData implements Partial<IAuxProperties<string>> {
    public type: AssetTypeName | "";
    public description?: string;
    public location?: string;
    public address?: string;
    public weight?: string;
    public weightUnit?: WeightUnitName;
    public fineness?: string;
    public value?: string;
    public valueCurrency?: CurrencyName;
    public quantity?: string;
    public notes?: string;

    /** @internal */
    // The high ABC is due to the number of properties that need to be assigned. Breaking this up would not improve
    // readability.
    // codebeat:disable[ABC]
    public constructor(asset?: AssetUnion) {
        this.type = AssetEditorData.getType(asset);
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

    private static getType(asset?: AssetUnion) {
        return asset && asset.type || "";
    }

    private static getDescription(asset?: AssetUnion) {
        return asset && asset.description;
    }

    private static getLocation(asset?: AssetUnion) {
        return asset && asset.location;
    }

    private static getAddress(asset?: AssetUnion) {
        return AssetEditorData.isCryptoWallet(asset) && asset.address || undefined;
    }

    private static getWeight(asset?: AssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? asset.weight.toString() : undefined;
    }

    private static getWeightUnit(asset?: AssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? WeightUnit[asset.weightUnit] as WeightUnitName : undefined;
    }

    private static getFineness(asset?: AssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? asset.fineness.toString() : undefined;
    }

    private static getValue(asset?: AssetUnion) {
        return AssetEditorData.isMiscAsset(asset) ? asset.value.toString() : undefined;
    }

    private static getValueCurrency(asset?: AssetUnion) {
        return AssetEditorData.isMiscAsset(asset) ? asset.valueCurrency : undefined;
    }

    private static getQuantity(asset?: AssetUnion) {
        return asset && (!AssetEditorData.isCryptoWallet(asset) || !asset.address) &&
            (asset.quantity !== undefined) && asset.quantity.toString() || undefined;
    }

    private static getNotes(asset?: AssetUnion) {
        return asset && asset.notes;
    }

    private static isCryptoWallet(asset?: AssetUnion): asset is ISimpleCryptoWallet | IErc20TokensWallet {
        return AssetEditorData.isType<ISimpleCryptoWallet>(simpleCryptoWalletTypeNames, asset) ||
            AssetEditorData.isType<IErc20TokensWallet>(erc20TokensWalletTypeNames, asset);
    }

    private static isPreciousMetalAsset(asset?: AssetUnion): asset is IPreciousMetalAsset {
        return AssetEditorData.isType<IPreciousMetalAsset>(preciousMetalAssetTypeNames, asset);
    }

    private static isMiscAsset(asset?: AssetUnion): asset is IMiscAsset {
        return AssetEditorData.isType<IMiscAsset>(miscAssetTypeNames, asset);
    }

    private static isType<T extends AssetUnion>(
        types: ReadonlyArray<T["type"]>, rawAsset?: AssetUnion,
    ): rawAsset is T {
        return (rawAsset && ObjectConverter.is<T>(rawAsset, types)) || false;
    }
}
