// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { bitcoinGold } from "./validation/schemas/AssetTypeName.schema";
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
        const url = `https://explorer.bitcoingold.org/insight-api/addr/${this.address}/balance`;

        // If the address is invalid, the server answers without setting the Access-Control-Allow-Origin header, which
        // keeps us from reading the error message in the body.
        return Number(await QueryCache.fetch(url, Number)) / 1E8;
    }
}
