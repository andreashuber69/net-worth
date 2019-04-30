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
import { CryptoWallet } from "./CryptoWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { IAssetProperties } from "./IAssetProperties";
import { ISerializedAsset } from "./ISerializedAsset";
import { AssetType } from "./validation/schemas/AssetType";
import { Erc20TokensWalletType } from "./validation/schemas/ISerializedErc20TokensWalletBundle";
import { QuantityAny } from "./validation/schemas/QuantityAny";

interface ITokenWalletParameters {
    readonly editable: Erc20TokensWallet;
    readonly currencySymbol: string;
    readonly quantity: QuantityAny;
    readonly unitValueUsd?: number;
}

export class Erc20TokenWallet extends CryptoWallet {
    public get type(): Erc20TokensWalletType {
        return this.editable.type;
    }

    public get description() {
        return this.editable.description;
    }

    public get location() {
        return this.editable.location;
    }

    public get address() {
        return this.editable.address;
    }

    public get notes() {
        return this.editable.notes;
    }

    public get editableAsset() {
        return this.editable;
    }

    public get interface(): IAssetUnion {
        throw new Error(`${Erc20TokenWallet.name} cannot be edited.`);
    }

    /** @internal */
    public constructor(params: ITokenWalletParameters) {
        super(params.editable.parent, params.currencySymbol);
        this.editable = params.editable;
        this.quantity = params.quantity;
        this.unitValueUsd = params.unitValueUsd;
    }

    // tslint:disable-next-line:prefer-function-over-method
    public toJSON(): ISerializedAsset<keyof typeof AssetType, IAssetProperties> {
        throw new Error(`${Erc20TokenWallet.name} cannot be serialized.`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly editable: Erc20TokensWallet;
}
