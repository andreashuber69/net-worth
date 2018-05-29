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
import { AssetInputInfo, IAssetConstructor } from "./AssetInputInfo";
import { IAssetInputInfo } from "./IAssetInputInfo";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";

/** Defines how a crypto currency wallet is edited in the asset editor UI. */
export class CryptoWalletEditInfo extends AssetInputInfo implements IAssetInputInfo {
    public readonly description = new TextInputInfo(
        "Description", "The purpose of the wallet, e.g. 'Spending', 'Savings', 'Cold Storage'.", true, true);
    public readonly location = new TextInputInfo(
        "Location", "The location of the wallet, e.g. 'Mobile Phone', 'Hardware Wallet', 'Safety Deposit Box'.",
        true, false);
    public readonly address = new TextInputInfo(
        "Address", "The public address of the wallet (single address or xpub).", true, false);
    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo();
    public readonly fineness = new TextInputInfo();
    public readonly quantity: TextInputInfo;

    /** @internal */
    public constructor(
        public readonly type: CryptoWalletTypes, quantityDecimals: number, constructor: IAssetConstructor) {
        super(constructor);
        this.quantity = new TextInputInfo(
            "Quantity", "The amount in the wallet.", true, false, 0, undefined, Math.pow(10, -quantityDecimals));
    }
}
