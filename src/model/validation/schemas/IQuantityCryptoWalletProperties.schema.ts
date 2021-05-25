// https://github.com/andreashuber69/net-worth#--
import type { IAssetProperties } from "./IAssetProperties.schema";
import type { QuantityAny } from "./QuantityAny.schema";

export interface IQuantityCryptoWalletProperties extends IAssetProperties {
    /** Provides the asset quantity. */
    readonly quantity: QuantityAny;
}
