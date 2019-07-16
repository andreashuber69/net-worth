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
import { Query } from "./Query";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { ICryptoWalletProperties } from "./validation/schemas/ICryptoWalletProperties";
import { SoChainGetAddressBalanceResponse } from "./validation/schemas/SoChainGetAddressBalanceResponse";

/** Represents a ZEC wallet. */
export class ZecWallet extends SimpleCryptoWallet {
    public readonly type = "Zcash";

    public constructor(parent: IParent, props: ICryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "ZEC", "zcash"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        return Number.parseFloat((await QueryCache.fetch(new ZecWallet.Query(this.address))).data.confirmed_balance);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line: max-classes-per-file variable-name
    private static readonly Query = class NestedQuery extends Query<SoChainGetAddressBalanceResponse> {
        public constructor(address: string) {
            super(`https://chain.so/api/v2/get_address_balance/ZEC/${address}`, SoChainGetAddressBalanceResponse);
        }
    };
}
