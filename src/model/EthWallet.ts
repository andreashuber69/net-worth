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
import { AssetBundle } from "./AssetBundle";
import { AssetType } from "./AssetTypes";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { Unknown, Value } from "./Value";

/** Represents an ETH wallet. */
export class EthWallet extends RealCryptoWallet {
    public readonly type = AssetType.Eth;

    /** Creates a new [[EthWallet]] instance.
     * @description If a non-empty string is passed for [[ICryptoWalletProperties.address]], then an attempt is made to
     * retrieve the wallet balance, which is then added to whatever is passed for [[ICryptoWalletProperties.quantity]].
     * It therefore usually only makes sense to specify either address or quantity, not both.
     * @param parent The parent model to which this asset belongs.
     * @param properties The crypto wallet properties.
     */
    public constructor(parent: IModel, properties: ICryptoWalletProperties) {
        super(parent, properties, "ETH", "ethereum");
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    public async queryData() {
        await super.queryData();

        if (this.address) {
            const response = await QueryCache.fetch(
                `https://api.ethplorer.io/getAddressInfo/${this.address}?apiKey=dvoio1769GSrYx63`);
            this.quantity = (this.quantity === undefined ? 0 : this.quantity) + EthWallet.getQuantity(response);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getQuantity(response: Unknown | null) {
        if (!Value.hasObjectProperty(response, "ETH") || !Value.hasNumberProperty(response.ETH, "balance")) {
            return Number.NaN;
        }

        return response.ETH.balance;
    }
}
