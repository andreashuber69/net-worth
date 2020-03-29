// https://github.com/andreashuber69/net-worth#--
import { IErc20TokensWalletBundle } from "./IErc20TokensWalletBundle.schema";
import { IMiscAssetBundle } from "./IMiscAssetBundle.schema";
import { IPreciousMetalAssetBundle } from "./IPreciousMetalAssetBundle.schema";
import { IQuantityCryptoWalletBundle } from "./IQuantityCryptoWalletBundle.schema";
import { ISimpleCryptoWalletBundle } from "./ISimpleCryptoWalletBundle.schema";

export type AssetBundleUnion =
    IPreciousMetalAssetBundle | ISimpleCryptoWalletBundle |
    IErc20TokensWalletBundle | IQuantityCryptoWalletBundle | IMiscAssetBundle;
