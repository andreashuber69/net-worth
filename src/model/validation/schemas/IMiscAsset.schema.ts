// https://github.com/andreashuber69/net-worth#--
import { misc } from "./AssetTypeName.schema";
import type { IMiscAssetProperties } from "./IMiscAssetProperties.schema";

export const miscAssetTypeNames = [misc] as const;

export type MiscAssetTypeName = typeof miscAssetTypeNames[number];

export interface IMiscObject {
    readonly type: MiscAssetTypeName;
}

export interface IMiscAsset extends IMiscObject, IMiscAssetProperties {
}
