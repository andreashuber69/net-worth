// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { zcash } from "./validation/schemas/AssetTypeName.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";
import { ZchainGetAccountResponse } from "./validation/schemas/ZchainGetAccountResponse.schema";

/** Represents a ZEC wallet. */
export class ZecWallet extends SimpleCryptoWallet {
    public static readonly type = zcash;

    public readonly type = zcash;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "ZEC"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        const url = `https://api.zcha.in/v2/mainnet/accounts/${this.address}`;

        // cSpell: ignore zcha
        // Apparently, zcha.in doesn't validate the address at all, which is why we don't expect an error response.
        return (await QueryCache.fetch(url, ZchainGetAccountResponse)).balance;
    }
}
