// https://github.com/andreashuber69/net-worth#--
import type { IQuantityCryptoWallet } from "./IQuantityCryptoWallet.schema";

export interface IQuantityCryptoWalletBundle {
    readonly primaryAsset: IQuantityCryptoWallet;
}
