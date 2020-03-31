// https://github.com/andreashuber69/net-worth#--
import { IAssetProperties } from "./IAssetProperties.schema";
import { QuantityAny } from "./QuantityAny.schema";

export interface IQuantityCryptoWalletProperties extends IAssetProperties {
    /** Provides the asset quantity. */
    readonly quantity: QuantityAny;
}
