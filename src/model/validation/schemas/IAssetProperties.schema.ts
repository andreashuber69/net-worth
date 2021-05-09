// https://github.com/andreashuber69/net-worth#--
import type { AssetTypeName } from "./AssetTypeName.schema";

/**
 * Defines the common editable properties of all assets.
 *
 * @description This interface (as well as its extending interfaces) defines the properties as they need to be provided
 * by the user as well as by the serialized form. Properties that are defined optional here are also optional in the UI
 * and during parsing.
 */
export interface IAssetProperties {
    /** Provides the location of the asset, e.g. 'Safe', 'Safety Deposit Box', 'Mobile Phone', 'Hardware Wallet'. */
    readonly location?: string;

    /** Provides the asset description, e.g. 'Bars', 'Coins', 'Spending', 'Savings'. */
    readonly description: string;

    /** Provides the asset notes. */
    readonly notes?: string;
}

export interface IAsset extends IAssetProperties {
    readonly type: AssetTypeName;
}
