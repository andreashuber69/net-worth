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
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { zcash } from "./validation/schemas/AssetTypeName.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";
import { ZchainGetAccountResponse } from "./validation/schemas/ZchainGetAccountResponse.schema";

/** Represents a ZEC wallet. */
export class ZecWallet extends SimpleCryptoWallet {
    public static readonly type = zcash;

    public readonly type = zcash;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "ZEC"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        const url = `https://api.zcha.in/v2/mainnet/accounts/${this.address}`;

        return (await QueryCache.fetch(url, ZchainGetAccountResponse)).balance;
    }
}
