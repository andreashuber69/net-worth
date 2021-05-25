// https://github.com/andreashuber69/net-worth#--
import { networks } from "@trezor/utxo-lib";
import { BlockchairWallet } from "./BlockchairWallet";
import type { IParent } from "./IEditable";
import { bitcoin } from "./validation/schemas/AssetTypeName.schema";
import type { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents a BTC wallet. */
export class BtcWallet extends BlockchairWallet {
    public static readonly type = bitcoin;

    public readonly type = bitcoin;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, BlockchairWallet.getParameters(props, networks.bitcoin));
    }
}
