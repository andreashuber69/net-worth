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
import { CryptoAsset } from "./CryptoAsset";

/** Provides information about a BTC asset. */
export class BtcAsset extends CryptoAsset {
    /** Creates a new [[BtcAsset]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param description The purpose of the wallet, e.g. 'Spending', 'Savings', 'Cold Storage'.
     * @param location The location of the wallet, e.g. 'Mobile Phone', 'Hardware Wallet', 'Safety Deposit Box'.
     * @param address The public address.
     * @param quantity The amount in the wallet.
     */
    public constructor(parent: IModel, description: string, location: string, address: string, quantity: number) {
        super(parent, "BTC", description, location, address, quantity, 8, "bitcoin");
    }
}