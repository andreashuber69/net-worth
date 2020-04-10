// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { networks } from "@trezor/utxo-lib";
import { FastXpub } from "./FastXpub";
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
            // TODO: This is a crude test to distinguish between xpub and a normal address
            if (this.address.length <= 100) {
                await this.add([this.address]);
            } else {
                const fastXpub = new FastXpub(networks.bitcoin);
                await Promise.all([
                    this.addChain(fastXpub, await fastXpub.deriveNode(this.address, 0)),
                    this.addChain(fastXpub, await fastXpub.deriveNode(this.address, 1)),
                ]);
            }

            return this.quantity;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static readonly minUnusedAddressesToCheck = 20;
        private static readonly batchLength = 20;

        private quantity = 0;

        private async add(addresses: readonly string[]) {
            const result = await new BtcWallet.BlockchainRequest(addresses).execute();
            this.quantity += result.finalBalance;

            return result;
        }

        private async addChain(fastXpub: FastXpub, xpub: string) {
            // eslint-disable-next-line init-declarations
            let batch: string[] | undefined;
            let unusedAddressesToCheck = NestedQuantityRequest.minUnusedAddressesToCheck;

            for (let index = 0; unusedAddressesToCheck > 0; index += batch.length) {
                // We need to do this sequentially such that we don't miss the point where the unused addresses start
                // eslint-disable-next-line no-await-in-loop
                batch = await fastXpub.deriveAddressRange(xpub, index, index + NestedQuantityRequest.batchLength - 1);

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
