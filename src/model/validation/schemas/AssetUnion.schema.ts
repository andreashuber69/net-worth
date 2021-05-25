// https://github.com/andreashuber69/net-worth#--
import type { IAddressCryptoWallet } from "./IAddressCryptoWallet.schema";
import type { IMiscAsset } from "./IMiscAsset.schema";
import type { IPreciousMetalAsset } from "./IPreciousMetalAsset.schema";
import type { IQuantityCryptoWallet } from "./IQuantityCryptoWallet.schema";
import type { ISimpleCryptoWallet } from "./ISimpleCryptoWallet.schema";

export type AssetUnion =
    IAddressCryptoWallet | IMiscAsset | IPreciousMetalAsset | IQuantityCryptoWallet | ISimpleCryptoWallet;
