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

import { IAssetUnion } from "./AssetInterfaces";
import { IAuxProperties } from "./IAuxProperties";
import { TaggedObjectConverter } from "./TaggedObjectConverter";
import { AssetTypeName } from "./validation/schemas/AssetTypeName";
import { CurrencyName } from "./validation/schemas/CurrencyName";
import { erc20TokensWalletTypeNames, ITaggedErc20TokensWallet } from "./validation/schemas/ITaggedErc20TokensWallet";
import { ITaggedMiscAsset, miscAssetTypeNames } from "./validation/schemas/ITaggedMiscAsset";
import { ITaggedPreciousMetalAsset, preciousMetalAssetTypeNames } from "./validation/schemas/ITaggedPreciousMetalAsset";
import { ITaggedSimpleCryptoWallet, simpleCryptoWalletTypeNames } from "./validation/schemas/ITaggedSimpleCryptoWallet";
import { TaggedAssetUnion } from "./validation/schemas/TaggedAssetUnion";
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
    public constructor(asset?: IAssetUnion) {
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

    private static getType(asset?: IAssetUnion) {
        return asset && asset.type || "";
    }

    private static getDescription(asset?: IAssetUnion) {
        return asset && asset.description;
    }

    private static getLocation(asset?: IAssetUnion) {
        return asset && asset.location;
    }

    private static getAddress(asset?: IAssetUnion) {
        return AssetEditorData.isCryptoWallet(asset) && asset.address || undefined;
    }

    private static getWeight(asset?: IAssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? asset.weight.toString() : undefined;
    }

    private static getWeightUnit(asset?: IAssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? WeightUnit[asset.weightUnit] as WeightUnitName : undefined;
    }

    private static getFineness(asset?: IAssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? asset.fineness.toString() : undefined;
    }

    private static getValue(asset?: IAssetUnion) {
        return AssetEditorData.isMiscAsset(asset) ? asset.value.toString() : undefined;
    }

    private static getValueCurrency(asset?: IAssetUnion) {
        return AssetEditorData.isMiscAsset(asset) ? asset.valueCurrency : undefined;
    }

    private static getQuantity(asset?: IAssetUnion) {
        return asset && (!AssetEditorData.isCryptoWallet(asset) || !asset.address) &&
            (asset.quantity !== undefined) && asset.quantity.toString() || undefined;
    }

    private static getNotes(asset?: IAssetUnion) {
        return asset && asset.notes;
    }

    private static isCryptoWallet(
        asset?: TaggedAssetUnion,
    ): asset is ITaggedSimpleCryptoWallet | ITaggedErc20TokensWallet {
        return AssetEditorData.isType<ITaggedSimpleCryptoWallet>(simpleCryptoWalletTypeNames, asset) ||
            AssetEditorData.isType<ITaggedErc20TokensWallet>(erc20TokensWalletTypeNames, asset);
    }

    private static isPreciousMetalAsset(asset?: TaggedAssetUnion): asset is ITaggedPreciousMetalAsset {
        return AssetEditorData.isType<ITaggedPreciousMetalAsset>(preciousMetalAssetTypeNames, asset);
    }

    private static isMiscAsset(asset?: TaggedAssetUnion): asset is ITaggedMiscAsset {
        return AssetEditorData.isType<ITaggedMiscAsset>(miscAssetTypeNames, asset);
    }

    private static isType<T extends TaggedAssetUnion>(
        types: ReadonlyArray<T["type"]>, rawAsset?: TaggedAssetUnion,
    ): rawAsset is T {
        return (rawAsset && TaggedObjectConverter.is<T>(rawAsset, types)) || false;
    }
}
