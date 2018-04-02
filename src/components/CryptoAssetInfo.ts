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
import { AssetInfo } from "./AssetInfo";

interface ISummary {
    final_balance: number;
    n_tx: number;
}

export class CryptoAssetInfo extends AssetInfo {
    public constructor(
        key: number,
        label: string,
        type: string,
        address: string,
        denomination: string) {
        super(key, label, type, address, 8, denomination);
    }

    public async update(): Promise<void> {
        // TODO: This is a crude test to distinguish between xpub and a normal address
        if (this.location.length > 100) {
            const rootNode = HDNode.fromBase58(this.location);
            this.amount = await CryptoAssetInfo.getRootBalance(rootNode.derive(0)) +
                await CryptoAssetInfo.getRootBalance(rootNode.derive(1));
        } else {
            const amount = await CryptoAssetInfo.getBalance([ this.location ]);
            this.amount = amount ? amount / 100000000 : 0;
        }
    }

    private static async getRootBalance(node: HDNode) {
        let balance = 0;
        let batch: string[];
        let batchBalance: number | undefined;

        for (
            let startIndex = 0;
            batchBalance = await this.getBalance(batch = this.getAddressBatch(node, startIndex));
            startIndex += batch.length) {
            balance += batchBalance;
        }

        return balance;
    }

    private static getAddressBatch(node: HDNode, startIndex: number) {
        const result = new Array<string>(20);

        for (let index = 0; index < 20; ++index) {
            result[index] = node.derive(index).getAddress();
        }

        return result;
    }

    private static async getBalance(addresses: string[]): Promise<number | undefined> {
        const response = await window.fetch(
            `https://blockchain.info/balance?active=${addresses.join("|")}&cors=true`);
        const summary = JSON.parse(await response.text());
        let transactionCount = 0;
        let result = 0;

        for (const address of addresses) {
            if (this.hasStringIndexer(summary)) {
                const balance = summary[address];

                if (this.isSummary(balance)) {
                    transactionCount += balance.n_tx;
                    result += balance.final_balance;
                }
            }
        }

        return (transactionCount > 0) ? result : undefined;
    }

    private static isObject(value: any): value is object {
        return value instanceof Object;
    }

    private static hasStringIndexer(value: any): value is { [key: string]: any } {
        return this.isObject(value);
    }

    private static isSummary(value: any): value is ISummary {
        return this.isObject(value) && value.hasOwnProperty("final_balance") && value.hasOwnProperty("n_tx");
    }
}
