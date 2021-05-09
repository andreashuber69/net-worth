// https://github.com/andreashuber69/net-worth#--
import { gold, palladium, platinum, silver } from "./AssetTypeName.schema";
import type { IPreciousMetalAssetProperties } from "./IPreciousMetalAssetProperties.schema";

export const preciousMetalAssetTypeNames = [silver, palladium, platinum, gold] as const;

export type PreciousMetalAssetTypeName = typeof preciousMetalAssetTypeNames[number];

export interface IPreciousMetalObject {
    readonly type: PreciousMetalAssetTypeName;
}

export interface IPreciousMetalAsset extends IPreciousMetalObject, IPreciousMetalAssetProperties {
}
