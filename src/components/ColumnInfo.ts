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

import { IOrdering } from "../model/Ordering";
import { GroupBy } from "../model/validation/schemas/GroupBy.schema";

import { ColumnName } from "./AssetListRow.vue";

export class ColumnInfo {
    /** Provides the maximum number of optional columns that can be displayed. */
    public static get maxOptionalCount() {
        return ColumnInfo.allCounts.length - 1;
    }

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

    private static readonly all: ReadonlyMap<GroupBy, readonly ColumnName[]> = new Map([
        ["type", ColumnInfo.getNames("type", "location")],
        ["location", ColumnInfo.getNames("location", "type")],
    ]);

    /**
     * From the list of columns returned by `getColumns`, contains the number of currently visible columns with the
     * index being the number of currently visible optional columns. For example, if no optional columns are currently
     * visible (i.e. index = 0), the first 5 columns of whatever is returned by `getColumns` will be shown.
     */
    private static readonly allCounts = [5, 6, 7, 8, 9, 10, 11, 12] as const;

    private static getNames(groupBy: GroupBy, otherGroupBy: GroupBy): readonly ColumnName[] {
        return [
            "expand", groupBy, "percent", "more", "grandTotalLabel", "totalValue", otherGroupBy, "unit",
            "quantity", "unitValue", "description", "fineness",
        ] as const;
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
            case "expand":
                return [leftClass, "pr-2"];
            case groupBy:
                return ["pl-0", rightClass];
            case otherGroupBys[0]:
            case "description":
            case "unit":
            case "fineness":
            case "unitValue":
            case "quantity":
            case "totalValue":
            case "grandTotalLabel":
                return [leftClass, rightClass];
            case "percent":
                return [leftClass, "pr-0"];
            case "more":
                return ["pl-1", rightClass];
            default:
                return [];
        }
    }

    private static getAlignment(name: ColumnName) {
        switch (name) {
            case "unitValue":
            case "totalValue":
            case "percent":
                return ["text-right"];
            default:
                return [];
        }
    }

    private static getTotal(name: ColumnName) {
        switch (name) {
            case "totalValue":
            case "percent":
            case "grandTotalLabel":
                return ["total"];
            default:
                return [];
        }
    }
}
