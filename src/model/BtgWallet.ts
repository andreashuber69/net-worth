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
import { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { Unknown } from "./Unknown";
import { Value } from "./Value";

/** Represents a BTG wallet. */
export class BtgWallet extends SimpleCryptoWallet {
    public readonly type = "Bitcoin Gold";

    public constructor(parent: IParent, props: ICryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "BTG", "bitcoin-gold"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected queryQuantity() {
        return new BtgWallet.BitcoinGoldRequest(this.address).execute();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:max-classes-per-file variable-name
    private static readonly BitcoinGoldRequest = class NestedBitcoinGoldRequest implements IWebRequest<number> {
        public constructor(private readonly address: string) {
        }

        public async execute() {
            return NestedBitcoinGoldRequest.getBalance(
                await QueryCache.fetch(`https://explorer.bitcoingold.org/insight-api/addr/${this.address}/balance`));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static getBalance(response: Unknown | null) {
            if (Value.isNumber(response)) {
                return response / 1E8;
            }

            throw new QueryError();
        }
    };
}
