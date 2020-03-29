// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { ethereumClassic } from "./validation/schemas/AssetTypeName.schema";
import { BlockscoutBalanceResponse } from "./validation/schemas/BlockscoutBalanceResponse.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents an ETC wallet. */
export class EtcWallet extends SimpleCryptoWallet {
    public static readonly type = ethereumClassic;

    public readonly type = ethereumClassic;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "ETC"));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryQuantity() {
        const response = await QueryCache.fetch(
            `https://blockscout.com/etc/mainnet/api?module=account&action=balance&address=${this.address}`,
            BlockscoutBalanceResponse,
            (r) => (r.status !== "1" && r.message) || undefined,
        );

        const result = Number.parseInt(response.result ?? "", 10);

        if (Number.isFinite(result)) {
            return result / 1E18;
        }

        throw new QueryError(`Unexpected balance: ${response.result}`);
    }
}
