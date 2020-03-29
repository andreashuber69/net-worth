// https://github.com/andreashuber69/net-worth#--
import { ISimpleCryptoWallet } from "./ISimpleCryptoWallet.schema";

export interface ISimpleCryptoWalletBundle {
    readonly primaryAsset: ISimpleCryptoWallet;
}
