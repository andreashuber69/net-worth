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

import { HDNode } from "bitcoinjs-lib";
import { CryptoAssetInfo } from "./CryptoAssetInfo";
import { Value } from "./Value";

/** @internal */
interface ISummary {
    final_balance: number;
    n_tx: number;
}

/** Provides information about a crypto currency asset. */
export class BtcInfo extends CryptoAssetInfo {
    /** Creates a new [[BtcInfo]] instance. */
    public constructor(address: string, description: string) {
        super(address, description, "BTC", 8, "bitcoin");
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @internal */
    public processCurrentQueryResponse(response: string) {
        if (super.processCurrentQueryResponse(response)) {
            const summary = JSON.parse(response);
            let transactionCount = 0;

            if (BtcInfo.hasStringIndexer(summary)) {
                for (const address in summary) {
                    if (summary.hasOwnProperty(address)) {
                        const balance = summary[address];

                        if (BtcInfo.isSummary(balance)) {
                            transactionCount += balance.n_tx;
                            this.balance += balance.final_balance;
                        }
                    }
                }
            }

            if (!transactionCount) {
                this.changeChain = true;
            }
        }

        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected * getQueries() {
        yield * super.getQueries();

        // TODO: This is a crude test to distinguish between xpub and a normal address
        if (this.location.length <= 100) {
            yield `https://blockchain.info/balance?active=${this.location}&cors=true`;
        } else {
            for (let chain = 0; chain < 2; ++chain) {
                for (let index = 0; !this.changeChain;) {
                    const batch = this.getAddressBatch(chain, index);
                    index += batch.length;
                    yield `https://blockchain.info/balance?active=${batch.join("|")}&cors=true`;
                }

                this.changeChain = false;
            }
        }
    }

    protected getValue() {
        const quantity = this.balance / 100000000;

        return new Value(quantity, quantity * this.price);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static isSummary(value: any): value is ISummary {
        return this.hasStringIndexer(value) && (typeof value.final_balance === "number") &&
            (typeof value.n_tx === "number");
    }

    private balance = 0;
    private changeChain = false;

    private getAddressBatch(chain: number, offset: number) {
        const node = HDNode.fromBase58(this.location).derive(chain);
        const result = new Array<string>(20);

        for (let index = 0; index < result.length; ++index) {
            result[index] = node.derive(offset + index).getAddress();
        }

        return result;
    }
}
