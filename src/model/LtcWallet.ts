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
import { BlockcypherWallet } from "./BlockcypherWallet";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { RealCryptoWallet } from "./RealCryptoWallet";

/** Represents an LTC wallet. */
export class LtcWallet extends BlockcypherWallet {
    public readonly type = "Litecoin";

    /** Creates a new [[LtcWallet]] instance.
     * @description If a non-empty string is passed for [[ICryptoWalletProperties.address]], then an attempt is made to
     * retrieve the wallet balance, which is then added to whatever is passed for [[ICryptoWalletProperties.quantity]].
     * It therefore usually only makes sense to specify either address or quantity, not both.
     * @param parent The parent model to which this asset belongs.
     * @param props The crypto wallet properties.
     */
    public constructor(parent: IModel, props: ICryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "LTC", "litecoin"));
    }
}
