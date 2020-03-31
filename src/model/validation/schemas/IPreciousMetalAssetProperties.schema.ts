// https://github.com/andreashuber69/net-worth#--
import { Fineness } from "./Fineness.schema";
import { IAssetProperties } from "./IAssetProperties.schema";
import { Quantity0 } from "./Quantity0.schema";
import { Weight } from "./Weight.schema";
import { WeightUnit } from "./WeightUnit.schema";

/** Contains the defining properties common to all precious metal assets. */
export interface IPreciousMetalAssetProperties extends IAssetProperties {
    /** Provides the weight of a single item, expressed in `weightUnit`. */
    readonly weight: Weight;

    /** Provides the unit used for `weight`, e.g. [[kg]]. */
    readonly weightUnit: WeightUnit;

    /** Provides the fineness, e.g. 0.999. */
    readonly fineness: Fineness;

    /** Provides the asset quantity. */
    readonly quantity: Quantity0;
}
