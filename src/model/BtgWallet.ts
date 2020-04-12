// https://github.com/andreashuber69/net-worth#--
// eslint-disable-next-line max-classes-per-file
import { networks } from "@trezor/utxo-lib";
import { IParent } from "./IEditable";
import { IBatchInfo, QuantityRequest } from "./QuantityRequest";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { bitcoinGold } from "./validation/schemas/AssetTypeName.schema";
import { InsightUtxoResponse, IUtxo } from "./validation/schemas/InsightUtxoResponse.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents a BTG wallet. */
export class BtgWallet extends SimpleCryptoWallet {
    public static readonly type = bitcoinGold;

    public readonly type = bitcoinGold;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "BTG"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        return new BtgWallet.BtgQuantityRequest(this.address).queryQuantity();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly BtgQuantityRequest = class extends QuantityRequest {
        public constructor(address: string) {
            super(networks.bitcoingold, address);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // eslint-disable-next-line class-methods-use-this
        protected async getBatchInfo(addresses: readonly string[]) {
            return this.getFinalBalance(await QueryCache.fetch(
                `https://explorer.bitcoingold.org/insight-api/addrs/${addresses.join(",")}/utxo`,
                InsightUtxoResponse,
                { getErrorMessage: (r) => (typeof r === "string" && r) || undefined },
            ));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private getFinalBalance(response: InsightUtxoResponse) {
            const result: IBatchInfo = { balance: 0, txCount: 0 };
            response.forEach((b) => this.addBalance(result, b));

            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        private addBalance(result: IBatchInfo, { amount }: IUtxo) {
            result.balance += amount;
            result.txCount += 1;
        }
    };
}
