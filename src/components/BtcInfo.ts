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

import { IModel } from "./AssetInfo";
import { CryptoAssetInfo } from "./CryptoAssetInfo";

/** Provides information about a BTC asset. */
export class BtcInfo extends CryptoAssetInfo {
    /** Creates a new [[BtcInfo]] instance.
     * @param model The model to which this asset belongs.
     * @param location The location of the Bitcoin, e.g. Paper Wallet or the public address.
     * @param description Describes the asset, e.g. Spending, Savings.
     * @param quantity The BTC amount.
     */
    public constructor(model: IModel, location: string, description: string, quantity: number) {
        super(model, location, description, "BTC", quantity, 8, "bitcoin");
    }
}
