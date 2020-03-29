// https://github.com/andreashuber69/net-worth#--
import { BlockcypherWallet } from "./BlockcypherWallet";
import { IParent } from "./IEditable";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { litecoin } from "./validation/schemas/AssetTypeName.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents an LTC wallet. */
export class LtcWallet extends BlockcypherWallet {
    public static readonly type = litecoin;

    public readonly type = litecoin;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "LTC"));
    }
}
