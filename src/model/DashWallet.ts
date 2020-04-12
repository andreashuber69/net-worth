// https://github.com/andreashuber69/net-worth#--
import { networks } from "@trezor/utxo-lib";
import { BlockchairWallet } from "./BlockchairWallet";
import { IParent } from "./IEditable";
import { dash } from "./validation/schemas/AssetTypeName.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents a DASH wallet. */
export class DashWallet extends BlockchairWallet {
    public static readonly type = dash;

    public readonly type = dash;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, BlockchairWallet.getParameters(props, networks.dash));
    }
}
