// https://github.com/andreashuber69/net-worth#--
import type { CurrencyName } from "./CurrencyName.schema";
import type { IAssetProperties } from "./IAssetProperties.schema";
import type { Quantity0 } from "./Quantity0.schema";

/** Contains the defining properties of a miscellaneous asset. */
export interface IMiscAssetProperties extends IAssetProperties {
    /** Provides the value of a single item, expressed in `valueCurrency`. */
    readonly value: number;

    /** Provides the currency used for `value`, e.g. [[Currency.USD]]. */
    readonly valueCurrency: CurrencyName;

    /** Provides the asset quantity. */
    readonly quantity: Quantity0;
}
