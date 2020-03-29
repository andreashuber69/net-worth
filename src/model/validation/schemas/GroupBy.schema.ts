// https://github.com/andreashuber69/net-worth#--
import { IAsset } from "./IAssetProperties.schema";

export type GroupBy = keyof Pick<IAsset, "type" | "location">;
