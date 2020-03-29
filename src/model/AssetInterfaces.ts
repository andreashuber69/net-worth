// https://github.com/andreashuber69/net-worth#--
import { arrayOfAll } from "./arrayOfAll";
import { AssetTypeName } from "./validation/schemas/AssetTypeName.schema";
import { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";
import { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Combines the defining properties of all assets. */
export type IAssetPropertiesIntersection =
    IPreciousMetalAssetProperties & ISimpleCryptoWalletProperties &
    IAddressCryptoWalletProperties & IQuantityCryptoWalletProperties & IMiscAssetProperties;

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
