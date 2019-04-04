// Copyright (C) 2018-2019 Andreas Huber Dönni
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
import { BlockcypherRequest } from "./BlockcypherRequest";
import { IRealCryptoWalletParameters, RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";

/** Represents a wallet the balance of which is requested from blockcypher.com. */
export abstract class BlockcypherWallet extends SimpleCryptoWallet {
    protected constructor(parent: IModel, params: IRealCryptoWalletParameters) {
        super(parent, params);
    }

    protected queryQuantity() {
        return new BlockcypherRequest(this.unit.toLowerCase(), this.address).execute();
    }
}
