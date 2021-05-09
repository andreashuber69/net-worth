// https://github.com/andreashuber69/net-worth#--
import type { IErc20TokensWalletBundle } from "./IErc20TokensWalletBundle.schema";
import type { IMiscAssetBundle } from "./IMiscAssetBundle.schema";
import type { IPreciousMetalAssetBundle } from "./IPreciousMetalAssetBundle.schema";
import type { IQuantityCryptoWalletBundle } from "./IQuantityCryptoWalletBundle.schema";
import type { ISimpleCryptoWalletBundle } from "./ISimpleCryptoWalletBundle.schema";

export type AssetBundleUnion =
    IPreciousMetalAssetBundle | ISimpleCryptoWalletBundle |
    IErc20TokensWalletBundle | IQuantityCryptoWalletBundle | IMiscAssetBundle;
