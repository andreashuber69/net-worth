// https://github.com/andreashuber69/net-worth#--
import { IAddressCryptoObject } from "./IAddressCryptoWallet.schema";
import { IMiscObject } from "./IMiscAsset.schema";
import { IPreciousMetalObject } from "./IPreciousMetalAsset.schema";
import { IQuantityCryptoObject } from "./IQuantityCryptoWallet.schema";
import { ISimpleCryptoObject } from "./ISimpleCryptoWallet.schema";

export type ObjectUnion =
    IPreciousMetalObject | ISimpleCryptoObject | IAddressCryptoObject | IQuantityCryptoObject | IMiscObject;
