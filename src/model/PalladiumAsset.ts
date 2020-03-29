// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { palladium } from "./validation/schemas/AssetTypeName.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";

/** Represents an asset made of palladium. */
export class PalladiumAsset extends PreciousMetalAsset {
    public static readonly type = palladium;

    public readonly type = palladium;

    public constructor(parent: IParent, props: IPreciousMetalAssetProperties) {
        super(parent, props, "lppm/pall.json");
    }
}
