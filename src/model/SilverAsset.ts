// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { silver } from "./validation/schemas/AssetTypeName.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";

/** Represents an asset made of silver. */
export class SilverAsset extends PreciousMetalAsset {
    public static readonly type = silver;

    public readonly type = silver;

    public constructor(parent: IParent, props: IPreciousMetalAssetProperties) {
        super(parent, props, "lbma/silver.json");
    }
}
