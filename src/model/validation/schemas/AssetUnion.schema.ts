// https://github.com/andreashuber69/net-worth#--
import { IAddressCryptoWallet } from "./IAddressCryptoWallet.schema";
import { IMiscAsset } from "./IMiscAsset.schema";
import { IPreciousMetalAsset } from "./IPreciousMetalAsset.schema";
import { IQuantityCryptoWallet } from "./IQuantityCryptoWallet.schema";
import { ISimpleCryptoWallet } from "./ISimpleCryptoWallet.schema";

export type AssetUnion =
    IPreciousMetalAsset | ISimpleCryptoWallet | IAddressCryptoWallet | IQuantityCryptoWallet | IMiscAsset;
