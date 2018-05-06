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
import { BlockchainRequest } from "./BlockchainRequest";
import { CryptoAsset } from "./CryptoAsset";

/** Provides information about a BTC asset. */
export class BtcQuantityAsset extends CryptoAsset {
    /** Creates a new [[BtcQuantityAsset]] instance.
     * @param model The model to which this asset belongs.
     * @param address The public address.
     * @param description Describes the asset, e.g. Spending, Savings.
     */
    public constructor(model: IModel, address: string, description: string) {
        super(model, address, description, "BTC", undefined, 8, "bitcoin");
        this.queryQuantity().catch((reason) => console.error(reason));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static delay(milliseconds: number) {
        return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
    }

    private async queryQuantity() {
        // TODO: This is a crude test to distinguish between xpub and a normal address
        if (this.location.length <= 100) {
            await this.add([ this.location ]);
        } else {
            await BtcQuantityAsset.delay(1000);
            // The following calls use a lot of CPU. By delaying first, we ensure that other queries can be sent,
            // their respective responses received and even rendered in the UI before the CPU is blocked.
            await this.addChain(0);
            await this.addChain(1);
        }
    }

    private async add(addresses: string[]) {
        const result = await new BlockchainRequest(addresses).execute();
        this.quantity = (this.quantity === undefined ? 0 : this.quantity) + result.finalBalance;

        return result.transactionCount !== 0;
    }

    private async addChain(chain: number) {
        let index = 0;
        let batch: string[] | undefined;

        // tslint:disable-next-line:no-empty
        for (; await this.add(batch = this.getBatch(chain, index)); index += batch.length) {
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
