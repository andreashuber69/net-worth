// Copyright (C) 2018-2019 Andreas Huber Dönni
//
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
// License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program. If not, see
// <http://www.gnu.org/licenses/>.

import { CalculatedAssetPropertyNames } from "../model/CalculatedAssetPropertyNames";
import { IOrdering } from "../model/Ordering";
import { GroupBy } from "../model/validation/schemas/GroupBy.schema";

import { AssetListRowPropertyName, ColumnName } from "./AssetListRow.vue";

export class ColumnInfo {
    /** Provides the maximum number of optional columns that can be displayed. */
    public static get maxOptionalCount() {
        return ColumnInfo.allCounts.length - 1;
    }

    /** @internal */
    public static readonly expandName = "expand";

    /** @internal */
    public static readonly moreName = "more";

    /** @internal */
    public static readonly grandTotalLabelName = "grandTotalLabel";

    /** @internal */
    public static getTotalCount(optionalCount: number) {
        return ColumnInfo.allCounts[optionalCount];
    }

    /** @internal */
    public static getHeaderClass(name: ColumnName, ordering: IOrdering, optionalCount: number) {
        return [
            ...ColumnInfo.getHidden(name, ordering.groupBy, optionalCount),
            ...ColumnInfo.getPadding(name, ordering.groupBy, ordering.otherGroupBys),
        ];
    }

    /** @internal */
    public static getClass(name: ColumnName, ordering: IOrdering, optionalCount: number) {
        return [
            ...ColumnInfo.getHidden(name, ordering.groupBy, optionalCount),
            ...ColumnInfo.getAlignment(name),
            ...ColumnInfo.getPadding(name, ordering.groupBy, ordering.otherGroupBys),
            ...ColumnInfo.getTotal(name),
        ];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly totalValueName = ColumnInfo.getName("totalValue");
    private static readonly percentName = ColumnInfo.getName("percent");

    private static readonly all: ReadonlyMap<GroupBy, readonly ColumnName[]> = new Map([
        ["type", ColumnInfo.getNames("type")],
        ["location", ColumnInfo.getNames("location")],
    ]);

    /**
     * From the list of columns returned by `getColumns`, contains the number of currently visible columns with the
     * index being the number of currently visible optional columns. For example, if no optional columns are currently
     * visible (i.e. index = 0), the first 5 columns of whatever is returned by `getColumns` will be shown.
     */
    private static readonly allCounts = [5, 6, 7, 8, 9, 10, 11, 12] as const;

    private static getName(name: AssetListRowPropertyName) {
        return name;
    }

    private static getNames(groupBy: GroupBy) {
        const result: ColumnName[] = [
            ColumnInfo.expandName, "type",
            CalculatedAssetPropertyNames.percent,
            ColumnInfo.moreName, ColumnInfo.grandTotalLabelName, CalculatedAssetPropertyNames.totalValue,
            "location", CalculatedAssetPropertyNames.unit,
            "quantity",
            CalculatedAssetPropertyNames.unitValue,
            "description",
            "fineness",
        ];

        if (groupBy === "location") {
            result[1] = "location";
            result[6] = "type";
        }

        return result;
    }

    private static getHidden(name: ColumnName, groupBy: GroupBy, optionalCount: number) {
        const all = ColumnInfo.all.get(groupBy);

        if (!all) {
            throw new Error("Unknown groupBy!");
        }

        if (all.indexOf(name) >= ColumnInfo.allCounts[optionalCount]) {
            // TODO: Can't this be done with one class?
            return ["hidden-sm-and-up", "hidden-xs-only"];
        }

        return [];
    }

    private static getPadding(name: ColumnName, groupBy: GroupBy, otherGroupBys: readonly GroupBy[]) {
        const padding = 3;
        const leftClass = `pl-${padding}`;
        const rightClass = `pr-${padding}`;

        switch (name) {
            case ColumnInfo.expandName:
                return [leftClass, "pr-2"];
            case groupBy:
                return ["pl-0", rightClass];
            case otherGroupBys[0]:
            case "description":
            case CalculatedAssetPropertyNames.unit:
            case "fineness":
            case CalculatedAssetPropertyNames.unitValue:
            case "quantity":
            case CalculatedAssetPropertyNames.totalValue:
            case ColumnInfo.grandTotalLabelName:
                return [leftClass, rightClass];
            case CalculatedAssetPropertyNames.percent:
                return [leftClass, "pr-0"];
            case ColumnInfo.moreName:
                return ["pl-1", rightClass];
            default:
                return [];
        }
    }

    private static getAlignment(name: ColumnName) {
        switch (name) {
            case CalculatedAssetPropertyNames.unitValue:
            case CalculatedAssetPropertyNames.totalValue:
            case CalculatedAssetPropertyNames.percent:
                return ["text-right"];
            default:
                return [];
        }
    }

    private static getTotal(name: ColumnName) {
        switch (name) {
            case ColumnInfo.totalValueName:
            case ColumnInfo.percentName:
            case ColumnInfo.grandTotalLabelName:
                return ["total"];
            default:
                return [];
        }
    }
}
