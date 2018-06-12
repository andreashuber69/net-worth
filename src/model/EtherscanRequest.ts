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

/** Represents a single etherscan.io request. */
export class EtherscanRequest implements IWebRequest<number> {
    /** Creates a new [[EtherscanRequest]] instance.
     *  @param address The address to query the balance for.
     */
    public constructor(private readonly address: string) {
    }

    public async execute() {
        return EtherscanRequest.getBalance(await QueryCache.fetch(
            `https://api.etherscan.io/api?module=account&action=balance&address=${this.address}&tag=latest`));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getBalance(response: Unknown | null) {
        if (!Value.hasStringProperty(response, "result")) {
            return Number.NaN;
        }

        return Number.parseFloat(response.result) / 1E18;
    }
}
