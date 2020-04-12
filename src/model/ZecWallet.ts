// https://github.com/andreashuber69/net-worth#--
import { networks } from "@trezor/utxo-lib";
import { BlockchairWallet } from "./BlockchairWallet";
import { IParent } from "./IEditable";
import { zcash } from "./validation/schemas/AssetTypeName.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents a ZEC wallet. */
export class ZecWallet extends BlockchairWallet {
    public static readonly type = zcash;

    public readonly type = zcash;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, BlockchairWallet.getParameters(props, networks.zcash));
    }
}
