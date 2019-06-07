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

import { Asset, IModel } from "./Asset";
import { AssetEditorData } from "./AssetEditorData";
import { ObjectConverter } from "./TaggedObjectConverter";
import { AssetTypeName } from "./validation/schemas/AssetTypeName";
import { Erc20TokensWalletTypeName, IErc20TokensWallet } from "./validation/schemas/ITaggedErc20TokensWallet";
import { IMiscAsset, MiscAssetTypeName } from "./validation/schemas/ITaggedMiscAsset";
import { IPreciousMetalAsset, PreciousMetalAssetTypeName } from "./validation/schemas/ITaggedPreciousMetalAsset";
import { ISimpleCryptoWallet, SimpleCryptoWalletTypeName } from "./validation/schemas/ITaggedSimpleCryptoWallet";
import { WeightUnit } from "./validation/schemas/WeightUnit";

class AssetProperties<T extends AssetTypeName> {
    public get type(): T {
        return AssetProperties.validate("type", this.data.type) as T;
    }

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

    public constructor(private readonly data: AssetEditorData) {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static validate<T extends string | undefined>(name: string, value: T): Exclude<T, undefined | ""> {
        if (!value) {
            throw new Error(`Unexpected ${name}.`);
        }

        return value as Exclude<T, undefined | "">;
    }
}

// tslint:disable-next-line: only-arrow-functions
export function getPreciousMetalProperties(data: AssetEditorData): IPreciousMetalAsset {
    return new AssetProperties<PreciousMetalAssetTypeName>(data);
}

// tslint:disable-next-line: only-arrow-functions
export function getSimpleCryptoWalletProperties(data: AssetEditorData): ISimpleCryptoWallet {
    return new AssetProperties<SimpleCryptoWalletTypeName>(data);
}

// tslint:disable-next-line: only-arrow-functions
export function getErc20TokensWalletProperties(data: AssetEditorData): IErc20TokensWallet {
    return new AssetProperties<Erc20TokensWalletTypeName>(data);
}

// tslint:disable-next-line: only-arrow-functions
export function getMiscAssetProperties(data: AssetEditorData): IMiscAsset {
    return new AssetProperties<MiscAssetTypeName>(data);
}

// tslint:disable-next-line: only-arrow-functions
export function createAsset(parent: IModel, data: AssetEditorData) {
    if (data.type === "") {
        throw new Error("Invalid asset type!");
    }

    return ObjectConverter.convert(
        { type: data.type },
        [
            (value, info) => ((model: IModel) => info.createAsset(model, getPreciousMetalProperties(data)) as Asset),
            (value, info) => ((model: IModel) => info.createAsset(model, getSimpleCryptoWalletProperties(data))),
            (value, info) => ((model: IModel) => info.createAsset(model, getErc20TokensWalletProperties(data))),
            (value, info) => ((model: IModel) => info.createAsset(model, getMiscAssetProperties(data))),
        ],
    )[1](parent);
}
