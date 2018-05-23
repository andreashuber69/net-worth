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

import { CryptoWalletTypes } from "../model/AssetTypes";
import { AssetInfo, IAssetConstructor } from "./AssetInfo";
import { IAssetInfo } from "./IAssetInfo";
import { SelectInfo } from "./SelectInfo";
import { TextFieldInfo } from "./TextFieldInfo";

/** Defines how a crypto currency wallet is displayed in the asset editor UI. */
export class CryptoWalletInfo extends AssetInfo implements IAssetInfo {
    public readonly description = new TextFieldInfo(
        "Description", "The purpose of the wallet, e.g. 'Spending', 'Savings', 'Cold Storage'.", true, true);
    public readonly location = new TextFieldInfo(
        "Location", "The location of the wallet, e.g. 'Mobile Phone', 'Hardware Wallet', 'Safety Deposit Box'.",
        true, false);
    public readonly address = new TextFieldInfo(
        "Address", "The public address of the wallet (single address or xpub).", true, false);
    public readonly weight = new TextFieldInfo();
    public readonly weightUnit = new SelectInfo<string>();
    public readonly fineness = new TextFieldInfo();
    public readonly quantity: TextFieldInfo;

    /** @internal */
    public constructor(
        public readonly type: CryptoWalletTypes, quantityDecimals: number, constructor: IAssetConstructor) {
        super(constructor);
        this.quantity = new TextFieldInfo(
            "Quantity", "The amount in the wallet.", true, false, 0, undefined, Math.pow(10, -quantityDecimals));
    }
}
