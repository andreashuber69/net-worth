// https://github.com/andreashuber69/net-worth#--
import type { IAddressCryptoObject } from "./IAddressCryptoWallet.schema";
import type { IMiscObject } from "./IMiscAsset.schema";
import type { IPreciousMetalObject } from "./IPreciousMetalAsset.schema";
import type { IQuantityCryptoObject } from "./IQuantityCryptoWallet.schema";
import type { ISimpleCryptoObject } from "./ISimpleCryptoWallet.schema";

export type ObjectUnion =
    IPreciousMetalObject | ISimpleCryptoObject | IAddressCryptoObject | IQuantityCryptoObject | IMiscObject;
