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
import { CryptoWallet, ICryptoWalletProperties } from "./CryptoWallet";

/** Represents a BTC wallet. */
export class BtcWallet extends CryptoWallet {
    public static readonly type = "Bitcoin";

    public readonly type = BtcWallet.type;

    /** Creates a new [[BtcWallet]] instance.
     * @description If a non-empty string is passed for [[ICryptoProperties.address]], then an attempt is made to
     * retrieve the wallet balance, which is then added to whatever is passed for [[ICryptoProperties.quantity]]. It
     * therefore usually only makes sense to specify either address or quantity, not both.
     * @param parent The parent model to which this asset belongs.
     * @param properties The crypto wallet properties.
     */
    public constructor(parent: IModel, properties: ICryptoWalletProperties) {
        super(parent, properties, "BTC", "bitcoin");
        this.queryQuantity().catch((reason) => console.error(reason));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static delay(milliseconds: number) {
        return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
    }

    private async queryQuantity() {
        if (this.address) {
            // TODO: This is a crude test to distinguish between xpub and a normal address
            if (this.address.length <= 100) {
                await this.add([ this.address ]);
            } else {
                await BtcWallet.delay(1000);
                // The following calls use a lot of CPU. By delaying first, we ensure that other queries can be sent,
                // their respective responses received and even rendered in the UI before the CPU is blocked.
                await this.addChain(0);
                await this.addChain(1);
            }
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
        const node = HDNode.fromBase58(this.address ? this.address : "").derive(chain);
        const result = new Array<string>(20);

        for (let index = 0; index < result.length; ++index) {
            result[index] = node.derive(offset + index).getAddress();
        }

        return result;
    }
}
