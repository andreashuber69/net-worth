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
import { CryptoAsset } from "./CryptoAsset";
import { QueryCache } from "./QueryCache";

/** @internal */
interface ISummary {
    final_balance: number;
    n_tx: number;
}

/** Provides information about a BTC asset. */
export class BtcQuantityAsset extends CryptoAsset {
    /** Creates a new [[BtcQuantityAsset]] instance.
     * @param model The model to which this asset belongs.
     * @param address The public address.
     * @param description Describes the asset, e.g. Spending, Savings.
     */
    public constructor(model: IModel, address: string, description: string) {
        super(model, address, description, "BTC", undefined, 8, "bitcoin");
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async executeQueries() {
        await super.executeQueries();

        // TODO: This is a crude test to distinguish between xpub and a normal address
        if (this.location.length <= 100) {
            await this.add(`https://blockchain.info/balance?active=${this.location}&cors=true`);
        } else {
            await this.valueChain(0);
            await this.valueChain(1);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static isSummary(value: any): value is ISummary {
        return this.hasStringIndexer(value) && (typeof value.final_balance === "number") &&
            (typeof value.n_tx === "number");
    }

    private static getFinalBalance(response: any) {
        const result = { finalBalance: Number.NaN, transactionCount: 0 };

        if (CryptoAsset.hasStringIndexer(response)) {
            for (const address in response) {
                if (response.hasOwnProperty(address)) {
                    const balance = response[address];

                    if (BtcQuantityAsset.isSummary(balance)) {
                        result.transactionCount += balance.n_tx;
                        result.finalBalance = (Number.isNaN(result.finalBalance) ? 0 : result.finalBalance) +
                            balance.final_balance / 100000000;
                    }
                }
            }
        }

        return result;
    }

    private async add(query: string) {
        const result = BtcQuantityAsset.getFinalBalance(await QueryCache.fetch(query));
        this.quantity = (this.quantity === undefined ? 0 : this.quantity) + result.finalBalance;

        return result.transactionCount !== 0;
    }

    private async valueChain(chain: number) {
        let index = 0;

        // tslint:disable:no-empty
        for (
            const batch = this.getBatch(chain, index);
            await this.add(`https://blockchain.info/balance?active=${batch.join("|")}&cors=true`);
            index += batch.length) {
        }
    }

    private getBatch(chain: number, offset: number) {
        const node = HDNode.fromBase58(this.location).derive(chain);
        const result = new Array<string>(20);

        for (let index = 0; index < result.length; ++index) {
            result[index] = node.derive(offset + index).getAddress();
        }

        return result;
    }
}
