// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { networks } from "@trezor/utxo-lib";
import { IParent } from "./IEditable";
import { IBatchInfo, QuantityRequest } from "./QuantityRequest";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { bitcoin } from "./validation/schemas/AssetTypeName.schema";
import { BlockchainBalanceResponse, IAddressBalance } from "./validation/schemas/BlockchainBalanceResponse.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents a BTC wallet. */
export class BtcWallet extends SimpleCryptoWallet {
    public static readonly type = bitcoin;

    public readonly type = bitcoin;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "BTC"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        return new BtcWallet.BtcQuantityRequest(this.address).queryQuantity();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly BtcQuantityRequest = class extends QuantityRequest {
        public constructor(address: string) {
            super(networks.bitcoin, address);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // eslint-disable-next-line class-methods-use-this
        protected async getBatchInfo(addresses: readonly string[]) {
            return this.getFinalBalance(await QueryCache.fetch(
                `https://blockchain.info/balance?active=${addresses.join("|")}&cors=true`,
                BlockchainBalanceResponse,
                { getErrorMessage: (r) => (typeof r.reason === "string" && r.reason) || undefined },
            ));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private getFinalBalance(response: BlockchainBalanceResponse) {
            const result: IBatchInfo = { balance: Number.NaN, txCount: 0 };
            const balances = Object.keys(response).map((k) => response[k]).filter(
                (v): v is IAddressBalance => typeof v === "object",
            );

            balances.forEach((b) => this.addBalance(result, b));

            if (Number.isNaN(result.balance)) {
                throw new QueryError();
            }

            return result;
        }

        // eslint-disable-next-line @typescript-eslint/camelcase, class-methods-use-this
        private addBalance(result: IBatchInfo, { final_balance, n_tx }: IAddressBalance) {
            // eslint-disable-next-line @typescript-eslint/camelcase
            result.balance = (Number.isNaN(result.balance) ? 0 : result.balance) + (final_balance / 1E8);
            // eslint-disable-next-line @typescript-eslint/camelcase
            result.txCount += n_tx;
        }
    };
}
