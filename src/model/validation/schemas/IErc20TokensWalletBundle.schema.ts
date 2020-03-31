// https://github.com/andreashuber69/net-worth#--
import { IAddressCryptoWalletBundle } from "./IAddressCryptoWalletBundle.schema";
import { IDeletedAssets } from "./IDeletedAssets.schema";

export interface IErc20TokensWalletBundle extends IAddressCryptoWalletBundle, IDeletedAssets {
}
