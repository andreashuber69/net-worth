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
import { CryptoWallet, ICryptoWalletProperties } from "./CryptoWallet";
import { EtherscanEthBalanceRequest } from "./EtherscanEthBalanceRequest";

/** Represents a BTC wallet. */
export class EthWallet extends CryptoWallet {
    public static readonly type = "Ethereum Wallet";

    public readonly type = EthWallet.type;

    /** Creates a new [[EthWallet]] instance.
     * @description If a non-empty string is passed for [[ICryptoProperties.address]], then an attempt is made to
     * retrieve the wallet balance, which is then added to whatever is passed for [[ICryptoProperties.quantity]]. It
     * therefore usually only makes sense to specify either address or quantity, not both.
     * @param parent The parent model to which this asset belongs.
     * @param properties The crypto wallet properties.
     */
    public constructor(parent: IModel, properties: ICryptoWalletProperties) {
        super(parent, properties, "ETH", 8, "ethereum");
        this.queryQuantity().catch((reason) => console.error(reason));
    }

    private async queryQuantity() {
        if (this.address) {
            this.quantity = (this.quantity === undefined ? 0 : this.quantity) +
                await new EtherscanEthBalanceRequest(this.address).execute();
        }
    }
}
