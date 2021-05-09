// https://github.com/andreashuber69/net-worth#--
import type { IParent } from "./IEditable";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { platinum } from "./validation/schemas/AssetTypeName.schema";
import type { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";

/** Represents an asset made of platinum. */
export class PlatinumAsset extends PreciousMetalAsset {
    public static readonly type = platinum;

    public readonly type = platinum;

    public constructor(parent: IParent, props: IPreciousMetalAssetProperties) {
        super(parent, props, "lppm/plat.json");
    }
}
