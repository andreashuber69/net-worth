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
import { PropertyInfo } from "./PropertyInfo";

/** Defines how a crypto currency wallet is displayed in the asset editor UI. */
export class CryptoWalletInfo extends AssetInfo implements IAssetInfo {
    public readonly description = new PropertyInfo(
        "Description", "The purpose of the wallet, e.g. 'Spending', 'Savings', 'Cold Storage'.", true, true);
    public readonly location = new PropertyInfo(
        "Location", "The location of the wallet, e.g. 'Mobile Phone', 'Hardware Wallet', 'Safety Deposit Box'.",
        true, false);
    public readonly address = new PropertyInfo(
        "Address", "The public address of the wallet (single address or xpub).", true, false);
    public readonly weight = new PropertyInfo();
    public readonly weightUnit = new PropertyInfo();
    public readonly fineness = new PropertyInfo();
    public readonly quantity: PropertyInfo;

    /** @internal */
    public constructor(
        public readonly type: CryptoWalletTypes, quantityDecimals: number, constructor: IAssetConstructor) {
        super(constructor);
        this.quantity = new PropertyInfo(
            "Quantity", "The amount in the wallet.", true, false, 0, undefined, Math.pow(10, -quantityDecimals));
    }
}
