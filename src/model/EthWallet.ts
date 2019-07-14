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

import { IParent } from "./Asset";
import { ICryptoWalletProperties } from "./ICryptoWalletProperties";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { Unknown } from "./Unknown";
import { Value } from "./Value";

/** Represents an ETH wallet. */
export class EthWallet extends SimpleCryptoWallet {
    public readonly type = "Ethereum";

    public constructor(parent: IParent, props: ICryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "ETH", "ethereum"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        const response =
            await QueryCache.fetch(`https://api.ethplorer.io/getAddressInfo/${this.address}?apiKey=dvoio1769GSrYx63`);

        return EthWallet.getQuantity(response);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getQuantity(response: Unknown | null) {
        if (!Value.hasObjectProperty(response, "ETH") || !Value.hasNumberProperty(response.ETH, "balance")) {
            throw new QueryError();
        }

        return response.ETH.balance;
    }
}
