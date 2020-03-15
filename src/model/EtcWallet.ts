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
import { QueryError } from "./QueryError";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { ethereumClassic } from "./validation/schemas/AssetTypeName.schema";
import { BlockscoutBalanceResponse } from "./validation/schemas/BlockscoutBalanceResponse.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents an ETC wallet. */
export class EtcWallet extends SimpleCryptoWallet {
    public static readonly type = ethereumClassic;

    public readonly type = ethereumClassic;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "ETC"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        const response = await QueryCache.fetch(
            `https://blockscout.com/etc/mainnet/api?module=account&action=balance&address=${this.address}`,
            BlockscoutBalanceResponse,
            (r) => (r.status !== "1" && r.message) || undefined,
        );

        const result = Number.parseInt(response.result ?? "", 10);

        if (Number.isFinite(result)) {
            return result / 1E18;
        }

        throw new QueryError(`Unexpected balance: ${response.result}`);
    }
}
