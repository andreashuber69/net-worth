// https://github.com/andreashuber69/net-worth#--
import { BlockcypherWallet } from "./BlockcypherWallet";
import { IParent } from "./IEditable";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { dash } from "./validation/schemas/AssetTypeName.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents a DASH wallet. */
export class DashWallet extends BlockcypherWallet {
    public static readonly type = dash;

    public readonly type = dash;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "DASH"));
    }
}
