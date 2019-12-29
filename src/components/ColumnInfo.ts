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

import { GroupBys, IOrdering } from "../model/Ordering";

import { ColumnName } from "./AssetListRow.vue";

export class ColumnInfo {
    /** Provides the maximum number of optional columns that can be displayed. */
    public static readonly maxOptionalCount = 7;

    /** @internal */
    public static getTotalCount(optionalCount: number) {
        return ColumnInfo.requiredCount + optionalCount;
    }

    /** @internal */
    public static getHeaderClass(name: ColumnName, ordering: IOrdering, optionalCount: number) {
        return [
            ...ColumnInfo.getHidden(name, ordering.groupBys, optionalCount),
            ...ColumnInfo.getPadding(name, ordering.groupBys),
        ];
    }

    /** @internal */
    public static getClass(name: ColumnName, ordering: IOrdering, optionalCount: number) {
        return [
            ...ColumnInfo.getHidden(name, ordering.groupBys, optionalCount),
            ...ColumnInfo.getAlignment(name),
            ...ColumnInfo.getPadding(name, ordering.groupBys),
            ...ColumnInfo.getTotal(name),
        ];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * This is the number of columns that are always visible. If no optional columns are currently shown (i.e.
     * optionalCount = 0), the first 5 columns of whatever is returned by `getAllNames` will be shown.
     */
    private static readonly requiredCount = 5;

    private static getHidden(name: ColumnName, groupBys: GroupBys, optionalCount: number) {

        if (ColumnInfo.getAllNames(groupBys).indexOf(name) >= ColumnInfo.getTotalCount(optionalCount)) {
            // TODO: Can't this be done with one class?
            return ["hidden-sm-and-up", "hidden-xs-only"];
        }

        return [];
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

    private static getPadding(name: ColumnName, groupBys: GroupBys) {
        const padding = 3;
        const leftClass = `pl-${padding}`;
        const rightClass = `pr-${padding}`;

        switch (name) {
            case "expand":
                return [leftClass, "pr-2"];
            case groupBys[0]:
                return ["pl-0", rightClass];
            case groupBys[1]:
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

    private static getAllNames(groupBys: GroupBys): readonly ColumnName[] {
        return [
            "expand", groupBys[0], "percent", "more", "grandTotalLabel", "totalValue", groupBys[1], "unit",
            "quantity", "unitValue", "description", "fineness",
        ] as const;
    }
}
