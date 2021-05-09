// https://github.com/andreashuber69/net-worth#--
import type { IAddressCryptoWallet } from "./IAddressCryptoWallet.schema";

export interface IAddressCryptoWalletBundle {
    readonly primaryAsset: IAddressCryptoWallet;
}
