// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { ethereum } from "./validation/schemas/AssetTypeName.schema";
import { EthplorerGetAddressInfoResponse } from "./validation/schemas/EthplorerGetAddressInfoResponse.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents an ETH wallet. */
export class EthWallet extends SimpleCryptoWallet {
    public static readonly type = ethereum;

    public readonly type = ethereum;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "ETH"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        const response = await QueryCache.fetch(
            `https://api.ethplorer.io/getAddressInfo/${this.address}?apiKey=dvoio1769GSrYx63`,
            EthplorerGetAddressInfoResponse,
            { getErrorMessage: (r) => r.error?.message },
        );

        return response.ETH?.balance ?? Number.NaN;
    }
}
