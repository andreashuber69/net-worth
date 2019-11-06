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

import { Asset, IParent } from "./Asset";
import { AssetEditorData } from "./AssetEditorData";
import { ObjectConverter } from "./ObjectConverter";
import { IErc20TokensWalletProperties } from "./validation/schemas/IErc20TokensWalletProperties.schema";
import { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";
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

// tslint:disable-next-line: max-classes-per-file
class RequiredQuantityAssetProperties extends AssetProperties {
    public get quantity() {
        return Number.parseFloat(AssetProperties.validate("quantity", this.data.quantity));
    }
}

// tslint:disable-next-line: max-classes-per-file
class RequiredAddressAssetProperties extends AssetProperties {
    public get address() {
        return AssetProperties.validate("address", this.data.address);
    }
}

// tslint:disable-next-line: only-arrow-functions
export function getPreciousMetalProperties(data: AssetEditorData): IPreciousMetalAssetProperties {
    return new RequiredQuantityAssetProperties(data);
}

// tslint:disable-next-line: only-arrow-functions
export function getSimpleCryptoWalletProperties(data: AssetEditorData): ISimpleCryptoWalletProperties {
    if (data.address) {
        return new RequiredAddressAssetProperties(data);
    } else if (data.quantity) {
        return new RequiredQuantityAssetProperties(data);
    } else {
        throw new Error("Invalid data!");
    }
}

// tslint:disable-next-line: only-arrow-functions
export function getErc20TokensWalletProperties(data: AssetEditorData): IErc20TokensWalletProperties {
    return new RequiredAddressAssetProperties(data);
}

// tslint:disable-next-line: only-arrow-functions
export function getMiscAssetProperties(data: AssetEditorData): IMiscAssetProperties {
    return new RequiredQuantityAssetProperties(data);
}

// tslint:disable-next-line: only-arrow-functions
export function createAsset(parent: IParent, data: AssetEditorData) {
    if (data.type === "") {
        throw new Error("Invalid asset type!");
    }

    return ObjectConverter.convert(
        { type: data.type },
        [
            (value, info) => ((p: IParent) => info.createAsset(p, getPreciousMetalProperties(data)) as Asset),
            (value, info) => ((p: IParent) => info.createAsset(p, getSimpleCryptoWalletProperties(data))),
            (value, info) => ((p: IParent) => info.createAsset(p, getErc20TokensWalletProperties(data))),
            (value, info) => ((p: IParent) => info.createAsset(p, getMiscAssetProperties(data))),
        ],
    )[1](parent);
}
