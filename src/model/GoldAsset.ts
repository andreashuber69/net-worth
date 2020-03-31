// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { gold } from "./validation/schemas/AssetTypeName.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";

/** Represents an asset made of gold. */
export class GoldAsset extends PreciousMetalAsset {
    public static readonly type = gold;

    public readonly type = gold;

    public constructor(parent: IParent, props: IPreciousMetalAssetProperties) {
        super(parent, props, "lbma/gold.json");
    }
}
