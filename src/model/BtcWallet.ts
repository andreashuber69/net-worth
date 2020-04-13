// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { networks } from "@trezor/utxo-lib";
import { IParent } from "./IEditable";
import { QuantityRequest } from "./QuantityRequest";
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
        protected async getOutputInfos(addresses: readonly string[]) {
            const response = await QueryCache.fetch(
                `https://blockchain.info/balance?active=${addresses.join("|")}&cors=true`,
                BlockchainBalanceResponse,
                { getErrorMessage: (r) => (typeof r.reason === "string" && r.reason) || undefined },
            );

            const balances = Object.values(response).filter((v): v is IAddressBalance => typeof v === "object");

            if (balances.length === 0) {
                throw new QueryError("Unexpected empty response.");
            }

            // eslint-disable-next-line @typescript-eslint/camelcase
            return balances.map(({ final_balance, n_tx }) => ({ balance: final_balance / 1E8, txCount: n_tx }));
        }
    };
}
