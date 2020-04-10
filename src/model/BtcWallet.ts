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
interface IBatchInfo {
    balance: number;
    txCount: number;
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

    private static readonly BlockchainRequest = class NestedBCRequest implements IWebRequest<Readonly<IBatchInfo>> {
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
            const result: IBatchInfo = { balance: Number.NaN, txCount: 0 };
            const balances = Object.keys(response).map((k) => response[k]).filter(
                (v): v is IAddressBalance => typeof v === "object",
            );

            balances.forEach((b) => NestedBCRequest.addBalance(result, b));

            if (Number.isNaN(result.balance)) {
                throw new QueryError();
            }

            return result;
        }

        // eslint-disable-next-line @typescript-eslint/camelcase
        private static addBalance(result: IBatchInfo, { final_balance, n_tx }: IAddressBalance) {
            // eslint-disable-next-line @typescript-eslint/camelcase
            result.balance = (Number.isNaN(result.balance) ? 0 : result.balance) + (final_balance / 1E8);
            // eslint-disable-next-line @typescript-eslint/camelcase
            result.txCount += n_tx;
        }

        private readonly addresses: string;
    };

    private static readonly QuantityRequest = class NestedQuantityRequest {
        public constructor(private readonly address: string) {
        }

        public async queryQuantity() {
            // TODO: This is a crude test to distinguish between xpub and a normal address
            if (this.address.length <= 100) {
                await this.getBatchInfo([this.address]);
            } else {
                await Promise.all([
                    this.addChain(await this.fastXpub.deriveNode(this.address, 0)),
                    this.addChain(await this.fastXpub.deriveNode(this.address, 1)),
                ]);
            }

            return this.quantity;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static readonly batchLength = 20;
        private readonly fastXpub = new FastXpub(networks.bitcoin);
        private quantity = 0;

        // eslint-disable-next-line class-methods-use-this
        private async getBatchInfo(addresses: readonly string[]) {
            return new BtcWallet.BlockchainRequest(addresses).execute();
        }

        private async addChain(xpub: string) {
            let done = false;
            let batch = await this.getBatch(xpub, 0);

            for (let index = NestedQuantityRequest.batchLength; !done; index += NestedQuantityRequest.batchLength) {
                // We need to do this sequentially such that we don't miss the point where unused addresses start
                // eslint-disable-next-line no-await-in-loop
                const results = await Promise.all([this.getBatchInfo(batch), this.getBatch(xpub, index)]);
                const [{ balance, txCount }] = results;
                this.quantity += balance;
                done = txCount === 0;
                [, batch] = results;
            }
        }

        private async getBatch(xpub: string, index: number) {
            return this.fastXpub.deriveAddressRange(xpub, index, index + NestedQuantityRequest.batchLength - 1);
        }
    };
}
