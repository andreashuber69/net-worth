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
import { AssetBundle } from "./AssetBundle";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { Unknown } from "./Unknown";
import { Value } from "./Value";

/** @internal */
interface IBalance {
    readonly finalBalance: number;
    readonly transactionCount: number;
}

/** Represents a BTC wallet. */
export class BtcWallet extends RealCryptoWallet {
    public readonly type = "Bitcoin";

    public constructor(parent: IModel, props: ICryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "BTC", "bitcoin"));
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected queryQuantity() {
        return new BtcWallet.QuantityRequest(this.address).queryQuantity();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:variable-name max-classes-per-file
    private static readonly BlockchainRequest = class NestedBlockchainRequest implements IWebRequest<IBalance> {
        public constructor(addresses: string[]) {
            this.addresses = addresses.join("|");
        }

        public async execute() {
            return NestedBlockchainRequest.getFinalBalance(
                await QueryCache.fetch(`https://blockchain.info/balance?active=${this.addresses}&cors=true`));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static getFinalBalance(response: Unknown | null) {
            const result = { finalBalance: Number.NaN, transactionCount: 0 };

            if (!Value.isObject(response)) {
                return result;
            }

            for (const address in response) {
                if (response.hasOwnProperty(address)) {
                    this.addBalance(response[address], result);
                }
            }

            return result;
        }

        private static addBalance(
            balance: Unknown | null | undefined, result: { finalBalance: number; transactionCount: number }) {
            if (Value.hasNumberProperty(balance, "final_balance") &&
                Value.hasNumberProperty(balance, "n_tx")) {
                result.transactionCount += balance.n_tx;
                result.finalBalance = (Number.isNaN(result.finalBalance) ? 0 : result.finalBalance) +
                    balance.final_balance / 1E8;
            }
        }

        private readonly addresses: string;
    };

    // tslint:disable-next-line:variable-name max-classes-per-file
    private static readonly QuantityRequest = class NestedQuantityRequest {
        public constructor(private readonly address: string) {
        }

        public async queryQuantity() {
            // TODO: This is a crude test to distinguish between xpub and a normal address
            if (this.address.length <= 100) {
                await this.add([ this.address ]);
            } else {
                await NestedQuantityRequest.delay(1000);
                const parent = HDNode.fromBase58(this.address);

                // The following calls use a lot of CPU. By delaying first, we ensure that other queries can be
                // sent, their respective responses received and even rendered in the UI before the CPU is blocked.
                await this.addChain(parent.derive(0));
                await this.addChain(parent.derive(1));
            }

            return this.quantity;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static readonly minUnusedAddressesToCheck = 20;
        private static batchLength = 2;

        private static delay(milliseconds: number) {
            return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
        }

        private static getBatch(node: HDNode, offset: number) {
            const result = new Array<string>(this.batchLength);
            const start = Date.now();

            for (let index = 0; index < result.length; ++index) {
                result[index] = node.derive(offset + index).getAddress();
            }

            if ((Date.now() - start < 500) && (this.batchLength < 16)) {
                // This is an attempt at making address derivation more bearable on browsers with lousy script execution
                // speed, e.g. Edge. Of course, this doesn't make the overall process faster, but it avoids blocking the
                // thread for longer than a second.
                this.batchLength *= 2;
            }

            return result;
        }

        private quantity = 0;

        private async add(addresses: string[]) {
            const result = await new BtcWallet.BlockchainRequest(addresses).execute();
            this.quantity += result.finalBalance;

            return result;
        }

        private async addChain(node: HDNode) {
            let batch: string[] | undefined;
            let unusedAddressesToCheck = NestedQuantityRequest.minUnusedAddressesToCheck;

            for (let index = 0; unusedAddressesToCheck > 0; index += batch.length) {
                batch = NestedQuantityRequest.getBatch(node, index);

                if ((await this.add(batch)).transactionCount === 0) {
                    unusedAddressesToCheck -= batch.length;
                } else {
                    unusedAddressesToCheck = NestedQuantityRequest.minUnusedAddressesToCheck;
                }
            }
        }
    };
}
