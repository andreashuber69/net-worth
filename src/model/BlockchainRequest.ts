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

import { IWebRequest } from "./IWebRequest";
import { ParseHelper, RequiredParsedValue } from "./ParseHelper";
import { QueryCache } from "./QueryCache";

/** Represents the result returned by [[BlockchainRequest.execute]]. */
export interface IBalance {
    /** Provides the sum of the final BTC balance of the addresses passed to the constructor. */
    readonly finalBalance: number;

    /** Provides the sum of the transactions found for the addresses passed to the constructor. */
    readonly transactionCount: number;
}

/** Represents a single blockchain.info request. */
export class BlockchainRequest implements IWebRequest<IBalance> {
    /** Creates a new [[BlockchainRequest]] instance.
     *  @param addresses The addresses to query the balance for.
     */
    public constructor(addresses: string[]) {
        this.addresses = addresses.join("|");
    }

    public async execute() {
        return BlockchainRequest.getFinalBalance(
            await QueryCache.fetch(`https://blockchain.info/balance?active=${this.addresses}&cors=true`));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getFinalBalance(response: RequiredParsedValue) {
        const result = { finalBalance: Number.NaN, transactionCount: 0 };

        if (ParseHelper.isObject(response)) {
            for (const address in response) {
                if (response.hasOwnProperty(address)) {
                    const balance = response[address];

                    if (ParseHelper.hasNumberProperty(balance, "final_balance") &&
                        ParseHelper.hasNumberProperty(balance, "n_tx")) {
                        result.transactionCount += balance.n_tx;
                        result.finalBalance = (Number.isNaN(result.finalBalance) ? 0 : result.finalBalance) +
                            balance.final_balance / 100000000;
                    }
                }
            }
        }

        return result;
    }

    private readonly addresses: string;
}
