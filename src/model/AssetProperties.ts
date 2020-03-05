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

/* eslint-disable max-classes-per-file */
import { Asset } from "./Asset";
import { AssetEditorData } from "./AssetEditorData";
import { IParent } from "./IEditable";
import { ObjectConverter } from "./ObjectConverter";
import { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";
import { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";
import { WeightUnit } from "./validation/schemas/WeightUnit.schema";

class AssetProperties {
    public get description() {
        return AssetProperties.validate("description", this.data.description);
    }

    public get location() {
        return this.data.location;
    }

    public get address() {
        return this.data.address;
    }

    public get weight() {
        return Number.parseFloat(AssetProperties.validate("weight", this.data.weight));
    }

    public get weightUnit() {
        return WeightUnit[AssetProperties.validate("weightUnit", this.data.weightUnit)];
    }

    public get fineness() {
        return Number.parseFloat(AssetProperties.validate("fineness", this.data.fineness));
    }

    public get value() {
        return Number.parseFloat(AssetProperties.validate("value", this.data.value));
    }

    public get valueCurrency() {
        return AssetProperties.validate("valueCurrency", this.data.valueCurrency);
    }

    public get quantity() {
        return this.data.quantity ? Number.parseFloat(this.data.quantity) : undefined;
    }

    public get notes() {
        return this.data.notes;
    }

    public constructor(protected readonly data: AssetEditorData) {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected static validate<T extends string | undefined>(name: string, value: T): Exclude<T, undefined | ""> {
        if (!value) {
            throw new Error(`Unexpected ${name}.`);
        }

        return value as Exclude<T, undefined | "">;
    }
}

class RequiredQuantityAssetProperties extends AssetProperties {
    public get quantity() {
        return Number.parseFloat(AssetProperties.validate("quantity", this.data.quantity));
    }
}

class RequiredAddressAssetProperties extends AssetProperties {
    public get address() {
        return AssetProperties.validate("address", this.data.address);
    }
}

export const getPreciousMetalProperties =
    (data: AssetEditorData): IPreciousMetalAssetProperties => new RequiredQuantityAssetProperties(data);

export const getSimpleCryptoWalletProperties = (data: AssetEditorData): ISimpleCryptoWalletProperties => {
    if (data.address) {
        return new RequiredAddressAssetProperties(data);
    } else if (data.quantity) {
        return new RequiredQuantityAssetProperties(data);
    }

    throw new Error("Invalid data!");
};

export const getAddressCryptoWalletProperties =
    (data: AssetEditorData): IAddressCryptoWalletProperties => new RequiredAddressAssetProperties(data);

export const getQuantityCryptoWalletProperties =
    (data: AssetEditorData): IQuantityCryptoWalletProperties => new RequiredQuantityAssetProperties(data);

export const getMiscAssetProperties =
    (data: AssetEditorData): IMiscAssetProperties => new RequiredQuantityAssetProperties(data);

export const createAsset = (parent: IParent, data: AssetEditorData) => {
    if (data.type === "") {
        throw new Error("Invalid asset type!");
    }

    return ObjectConverter.convert(
        { type: data.type },
        [
            (value, info) => ((p: IParent) => info.createAsset(p, getPreciousMetalProperties(data)) as Asset),
            (value, info) => ((p: IParent) => info.createAsset(p, getSimpleCryptoWalletProperties(data))),
            (value, info) => ((p: IParent) => info.createAsset(p, getAddressCryptoWalletProperties(data))),
            (value, info) => ((p: IParent) => info.createAsset(p, getQuantityCryptoWalletProperties(data))),
            (value, info) => ((p: IParent) => info.createAsset(p, getMiscAssetProperties(data))),
        ],
    )[1](parent);
};
