// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { HDNode } from "bitcoinjs-lib";
import { IParent } from "./IEditable";
import { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { bitcoin } from "./validation/schemas/AssetTypeName.schema";
import { BlockchainBalanceResponse, IAddressBalance } from "./validation/schemas/BlockchainBalanceResponse.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** @internal */
interface IBalance {
    finalBalance: number;
    transactionCount: number;
}

/** Represents a BTC wallet. */
export class BtcWallet extends SimpleCryptoWallet {
    public static readonly type = bitcoin;

    public readonly type = bitcoin;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "BTC"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        return new BtcWallet.QuantityRequest(this.address).queryQuantity();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly BlockchainRequest = class NestedBCRequest implements IWebRequest<Readonly<IBalance>> {
        public constructor(addresses: readonly string[]) {
            this.addresses = addresses.join("|");
        }

        public async execute() {
            return NestedBCRequest.getFinalBalance(await QueryCache.fetch(
                `https://blockchain.info/balance?active=${this.addresses}&cors=true`,
                BlockchainBalanceResponse,
                (r) => (typeof r.reason === "string" && r.reason) || undefined,
            ));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static getFinalBalance(response: BlockchainBalanceResponse) {
            const result: IBalance = { finalBalance: Number.NaN, transactionCount: 0 };
            const balances = Object.keys(response).map((k) => response[k]).filter(
                (v): v is IAddressBalance => typeof v === "object",
            );

            balances.forEach((b) => NestedBCRequest.addBalance(result, b));

            if (Number.isNaN(result.finalBalance)) {
                throw new QueryError();
            }

            return result;
        }

        // eslint-disable-next-line @typescript-eslint/camelcase
        private static addBalance(result: IBalance, { final_balance, n_tx }: IAddressBalance) {
            // eslint-disable-next-line @typescript-eslint/camelcase
            result.finalBalance = (Number.isNaN(result.finalBalance) ? 0 : result.finalBalance) + (final_balance / 1E8);
            // eslint-disable-next-line @typescript-eslint/camelcase
            result.transactionCount += n_tx;
        }

        private readonly addresses: string;
    };

    private static readonly QuantityRequest = class NestedQuantityRequest {
        public constructor(private readonly address: string) {
        }

        public async queryQuantity() {
            // cSpell: ignore xpub
            // TODO: This is a crude test to distinguish between xpub and a normal address
            if (this.address.length <= 100) {
                await this.add([this.address]);
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

        private static async delay(milliseconds: number) {
            return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
        }

        private static getBatch(node: HDNode, offset: number) {
            const result = new Array<string>(NestedQuantityRequest.batchLength);
            const start = Date.now();

            for (let index = 0; index < result.length; ++index) {
                result[index] = node.derive(offset + index).getAddress();
            }

            if ((Date.now() - start < 500) && (NestedQuantityRequest.batchLength < 16)) {
                // This is an attempt at making address derivation more bearable on browsers with lousy script execution
                // speed, e.g. Edge. Of course, this doesn't make the overall process faster, but it avoids blocking the
                // thread for longer than a second.
                NestedQuantityRequest.batchLength *= 2;
            }

            return result;
        }

        private quantity = 0;

        private async add(addresses: readonly string[]) {
            const result = await new BtcWallet.BlockchainRequest(addresses).execute();
            this.quantity += result.finalBalance;

            return result;
        }

        private async addChain(node: HDNode) {
            // eslint-disable-next-line init-declarations
            let batch: string[] | undefined;
            let unusedAddressesToCheck = NestedQuantityRequest.minUnusedAddressesToCheck;

            for (let index = 0; unusedAddressesToCheck > 0; index += batch.length) {
                batch = NestedQuantityRequest.getBatch(node, index);

                // We need to do this sequentially such that we don't miss the point where the unused addresses start
                // eslint-disable-next-line no-await-in-loop
                if ((await this.add(batch)).transactionCount === 0) {
                    unusedAddressesToCheck -= batch.length;
                } else {
                    unusedAddressesToCheck = NestedQuantityRequest.minUnusedAddressesToCheck;
                }
            }
        }
    };
}
