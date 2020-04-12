// https://github.com/andreashuber69/net-worth#--
// eslint-disable-next-line max-classes-per-file
import { networks } from "@trezor/utxo-lib";
import { IParent } from "./IEditable";
import { QuantityRequest } from "./QuantityRequest";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { bitcoinGold } from "./validation/schemas/AssetTypeName.schema";
import { InsightUtxoResponse } from "./validation/schemas/InsightUtxoResponse.schema";
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
        protected async getOutputInfos(addresses: readonly string[]) {
            const response = await QueryCache.fetch(
                `https://explorer.bitcoingold.org/insight-api/addrs/${addresses.join(",")}/utxo`,
                InsightUtxoResponse,
                { getErrorMessage: (r) => (typeof r === "string" && r) || undefined },
            );

            return response.map(({ amount }) => ({ balance: amount, txCount: 1 }));
        }
    };
}
