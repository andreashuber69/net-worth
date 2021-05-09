// https://github.com/andreashuber69/net-worth#--
import type { IPreciousMetalAsset } from "./IPreciousMetalAsset.schema";

export interface IPreciousMetalAssetBundle {
    readonly primaryAsset: IPreciousMetalAsset;
}
