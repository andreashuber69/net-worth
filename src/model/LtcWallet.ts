// https://github.com/andreashuber69/net-worth#--
import { networks } from "@trezor/utxo-lib";
import { BlockchairWallet } from "./BlockchairWallet";
import { IParent } from "./IEditable";
import { litecoin } from "./validation/schemas/AssetTypeName.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Represents an LTC wallet. */
export class LtcWallet extends BlockchairWallet {
    public static readonly type = litecoin;

    public readonly type = litecoin;

    public constructor(parent: IParent, props: ISimpleCryptoWalletProperties) {
        super(parent, BlockchairWallet.getParameters(props, networks.litecoin));
    }
}
