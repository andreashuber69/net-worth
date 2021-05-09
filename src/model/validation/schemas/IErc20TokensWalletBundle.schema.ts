// https://github.com/andreashuber69/net-worth#--
import type { IAddressCryptoWalletBundle } from "./IAddressCryptoWalletBundle.schema";
import type { IDeletedAssets } from "./IDeletedAssets.schema";

export interface IErc20TokensWalletBundle extends IAddressCryptoWalletBundle, IDeletedAssets {
}
