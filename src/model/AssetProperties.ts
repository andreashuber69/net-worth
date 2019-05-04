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

import { AssetEditorData } from "./AssetEditorData";
import { IAssetIntersection } from "./AssetInterfaces";
import { WeightUnit } from "./validation/schemas/WeightUnit";

abstract class AssetProperties {
    public get type() {
        return AssetProperties.validate("type", this.data.type);
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(private readonly data: AssetEditorData) {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static validate<T extends string | undefined>(name: string, value: T): Exclude<T, undefined | ""> {
        if (!value) {
            throw new Error(`Unexpected ${name}.`);
        }

        return value as Exclude<T, undefined | "">;
    }
}

// tslint:disable-next-line: max-classes-per-file
class PreciousMetalProperties extends AssetProperties implements IAssetIntersection {
    public constructor(data: AssetEditorData) {
        super(data);
    }
}

// tslint:disable-next-line: max-classes-per-file
class SimpleCryptoWalletProperties extends AssetProperties implements IAssetIntersection {
    public constructor(data: AssetEditorData) {
        super(data);
    }
}

// tslint:disable-next-line: max-classes-per-file
class Erc20TokensWalletProperties extends AssetProperties implements IAssetIntersection {
    public constructor(data: AssetEditorData) {
        super(data);
    }
}

// tslint:disable-next-line: max-classes-per-file
class MiscAssetProperties extends AssetProperties implements IAssetIntersection {
    public constructor(data: AssetEditorData) {
        super(data);
    }
}

// tslint:disable-next-line: only-arrow-functions
export function getProperties(data: AssetEditorData): IAssetIntersection {
    // tslint:disable-next-line: switch-default
    switch (data.type) {
        case "Silver":
        case "Palladium":
        case "Platinum":
        case "Gold":
            return new PreciousMetalProperties(data);
        case "Bitcoin":
        case "Litecoin":
        case "Ethereum Classic":
        case "Ethereum":
        case "Bitcoin Gold":
        case "Dash":
        case "Zcash":
            return new SimpleCryptoWalletProperties(data);
        case "ERC20 Tokens":
            return new Erc20TokensWalletProperties(data);
        case "Misc":
            return new MiscAssetProperties(data);
        case "":
            throw new Error("Invalid asset type!");
    }
}
