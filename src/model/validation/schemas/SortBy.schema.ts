// https://github.com/andreashuber69/net-worth#--
import { IAsset } from "./IAssetProperties.schema";
import { ICalculatedAssetProperties } from "./ICalculatedAssetProperties.schema";

export type SortBy =
    keyof Pick<IAsset, "type" | "location" | "description"> |
    keyof Pick<ICalculatedAssetProperties, "unitValue" | "totalValue">;
