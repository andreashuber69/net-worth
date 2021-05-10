// https://github.com/andreashuber69/net-worth#--
import { arrayOfAll } from "./arrayOfAll";
import type { AssetTypeName } from "./validation/schemas/AssetTypeName.schema";
import type { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";
import type { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties.schema";
import type { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";
import type { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";

/** Combines the defining properties of all assets. */
export type IAssetPropertiesIntersection =
    IAddressCryptoWalletProperties & IMiscAssetProperties &
    IPreciousMetalAssetProperties & IQuantityCryptoWalletProperties;

export type IAssetIntersection = IAssetPropertiesIntersection & {
    readonly type: AssetTypeName;
};

export type AssetPropertyName = keyof IAssetPropertiesIntersection;

export const allAssetPropertyNames = arrayOfAll<AssetPropertyName>()(
    "description",
    "location",
    "quantity",
    "notes",
    "weight",
    "weightUnit",
    "fineness",
    "address",
    "value",
    "valueCurrency",
);
