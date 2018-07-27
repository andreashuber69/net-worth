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

import { IModel } from "./Asset";
import { AssetType } from "./AssetTypes";
import { CryptoWallet } from "./CryptoWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { ICryptoWalletProperties } from "./ICryptoWallet";

/** Represents a wallet for a single ERC20 token. */
export class Erc20TokenWallet extends CryptoWallet {
    public readonly type = AssetType.Erc20;

    public get editableAsset() {
        return this.editable;
    }

    /** @internal */
    public constructor(
        parent: IModel, private readonly editable: Erc20TokensWallet,
        properties: ICryptoWalletProperties, currencySymbol: string, unitValueUsd: number) {
        super(parent, properties, currencySymbol);
        this.unitValueUsd = unitValueUsd;
    }
}
