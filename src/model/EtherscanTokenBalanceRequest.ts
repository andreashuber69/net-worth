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

/** Represents a single etherscan.io request to get the token balance of an address. */
export class EtherscanTokenBalanceRequest implements IWebRequest<number> {
    /**
     * Creates a new [[EtherscanTokenBalanceRequest]] instance.
     * @param address The address to query the balance for.
     * @param contractAddress The contract address of the token.
     * @param decimals The number of decimal digits of the token.
     */
    public constructor(
        private readonly address: string, private readonly contractAddress: string, private readonly decimals: number) {
    }

    public async execute() {
        return this.getBalance(await QueryCache.fetch(
            "https://api.etherscan.io/api?module=account&action=tokenbalance&" +
                `contractaddress=${this.contractAddress}&address=${this.address}&tag=latest`));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private getBalance(response: Unknown | null) {
        if (!Value.hasStringProperty(response, "result")) {
            return Number.NaN;
        }

        return Number.parseFloat(response.result) / Math.pow(10, this.decimals);
    }
}
