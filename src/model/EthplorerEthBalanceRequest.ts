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
import { QueryCache } from "./QueryCache";
import { Unknown, Value } from "./Value";

/** Represents a single ethplorer.io request to get the ETH balance of an address. */
export class EthplorerEthBalanceRequest implements IWebRequest<number> {
    /** Creates a new [[EthplorerEthBalanceRequest]] instance.
     *  @param address The address to query the balance for.
     */
    public constructor(private readonly address: string) {
    }

    public async execute() {
        return EthplorerEthBalanceRequest.getBalance(await QueryCache.fetch(
            `https://api.ethplorer.io/getAddressInfo/${this.address}?` +
            "token=0x0000000000000000000000000000000000000000&apiKey=freekey"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getBalance(response: Unknown | null) {
        if (!Value.hasObjectProperty(response, "ETH") || !Value.hasNumberProperty(response.ETH, "balance")) {
            return Number.NaN;
        }

        return response.ETH.balance;
    }
}
