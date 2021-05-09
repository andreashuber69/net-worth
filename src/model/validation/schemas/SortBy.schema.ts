// https://github.com/andreashuber69/net-worth#--
import type { IAsset } from "./IAssetProperties.schema";
import type { ICalculatedAssetProperties } from "./ICalculatedAssetProperties.schema";

export type SortBy =
    keyof Pick<IAsset, "type" | "location" | "description"> |
    keyof Pick<ICalculatedAssetProperties, "unitValue" | "totalValue">;
