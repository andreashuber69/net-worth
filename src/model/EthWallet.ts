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

import { IParent } from "./IEditable";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { ethereum } from "./validation/schemas/AssetTypeName.schema";
import { EthplorerGetAddressInfoResponse } from "./validation/schemas/EthplorerGetAddressInfoResponse.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents an ETH wallet. */
export class EthWallet extends SimpleCryptoWallet {
    public static readonly type = ethereum;

    public readonly type = ethereum;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "ETH"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        const response = await QueryCache.fetch(
            `https://api.ethplorer.io/getAddressInfo/${this.address}?apiKey=dvoio1769GSrYx63`,
            EthplorerGetAddressInfoResponse,
            (r) => r.error?.message,
        );

        return response.ETH?.balance ?? Number.NaN;
    }
}
