// https://github.com/andreashuber69/net-worth#--
import type { IAsset } from "./IAssetProperties.schema";

export type GroupBy = keyof Pick<IAsset, "type" | "location">;
