// https://github.com/andreashuber69/net-worth#--
import type { AssetDisplayPropertyName } from "../model/Asset";
import type { GroupBys } from "../model/Ordering";

export type ColumnName = AssetDisplayPropertyName | "expand" | "more";

export class ColumnInfo {
    /**
     * This is the number of columns that are always visible. If no optional columns are currently shown
     * (optionalCount = 0), the first 4 columns of whatever is returned by `getAllNames` will be shown.
     */
    public static readonly requiredCount = 4;

    /** Provides the maximum number of optional columns that can be displayed. */
    public static readonly maxOptionalCount = 7;

    /** @internal */
    public static getTotalCount(optionalCount: number) {
        return ColumnInfo.requiredCount + optionalCount;
    }

    public static getAllNames(groupBys: GroupBys): readonly ColumnName[] {
        return [
            "expand",
            groupBys[0],
            "percent",
            "more",
            "totalValue",
            groupBys[1],
            "unit",
            "quantity",
            "unitValue",
            "description",
            "fineness",
        ] as const;
    }
}
