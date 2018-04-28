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
import { IModel } from "./Asset";
import { CryptoAssetInfo } from "./CryptoAssetInfo";

/** @internal */
interface ISummary {
    final_balance: number;
    n_tx: number;
}

/** Provides information about a BTC asset. */
export class BtcQuantityInfo extends CryptoAssetInfo {
    /** Creates a new [[BtcQuantityInfo]] instance.
     * @param model The model to which this asset belongs.
     * @param address The public address.
     * @param description Describes the asset, e.g. Spending, Savings.
     */
    public constructor(model: IModel, address: string, description: string) {
        super(model, address, description, "BTC", undefined, 8, "bitcoin");
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

    protected processQueryResponse(response: any) {
        if (super.processQueryResponse(response)) {
            this.quantity = (this.quantity === undefined ? 0 : this.quantity) + this.getFinalBalance(response);
        }

        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static isSummary(value: any): value is ISummary {
        return this.hasStringIndexer(value) && (typeof value.final_balance === "number") &&
            (typeof value.n_tx === "number");
    }

    private changeChain = false;

    private getFinalBalance(response: any) {
        let result = Number.NaN;
        let transactionCount = 0;

        if (CryptoAssetInfo.hasStringIndexer(response)) {
            for (const address in response) {
                if (response.hasOwnProperty(address)) {
                    const balance = response[address];

                    if (BtcQuantityInfo.isSummary(balance)) {
                        transactionCount += balance.n_tx;
                        result = (Number.isNaN(result) ? 0 : result) + balance.final_balance / 100000000;
                    }
                }
            }
        }

        if (!transactionCount) {
            this.changeChain = true;
        }

        return result;
    }

    private getAddressBatch(chain: number, offset: number) {
        const node = HDNode.fromBase58(this.location).derive(chain);
        const result = new Array<string>(20);

        for (let index = 0; index < result.length; ++index) {
            result[index] = node.derive(offset + index).getAddress();
        }

        return result;
    }
}
