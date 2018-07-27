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

import { IAssetUnion, ISerializedAsset } from "./AssetInterfaces";
import { CryptoWallet } from "./CryptoWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";

/** Represents a wallet for a single ERC20 token. */
export class Erc20TokenWallet extends CryptoWallet {
    public get type() {
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
        throw new Error("Can't get non-real wallet interface.");
    }

    /** @internal */
    public constructor(
        private readonly editable: Erc20TokensWallet, currencySymbol: string, quantity: number, unitValueUsd: number) {
        super(editable.parent, currencySymbol);
        this.quantity = quantity;
        this.unitValueUsd = unitValueUsd;
    }

    // tslint:disable-next-line:prefer-function-over-method
    public toJSON(): ISerializedAsset {
        throw new Error("Can't serialize non-real wallet");
    }
}
