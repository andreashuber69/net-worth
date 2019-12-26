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

import { Asset } from "../model/Asset";
import { AssetPropertyNames } from "../model/AssetPropertyNames";
import { CalculatedAssetPropertyNames } from "../model/CalculatedAssetPropertyNames";
import { IOrdering } from "../model/Ordering";
import { GroupBy } from "../model/validation/schemas/GroupBy.schema";

import { AssetListRowPropertyName, ColumnName } from "./AssetListRow.vue";

export class ColumnInfo {
    /** Provides the maximum number of optional columns that can be displayed. */
    public static get maxOptionalCount() {
        return ColumnInfo.allColumnCounts.length - 1;
    }

    /** @internal */
    public static readonly expandName = "expand";

    /** @internal */
    public static readonly moreName = "more";

    /** @internal */
    public static readonly grandTotalLabelName = "grandTotalLabel";

    /** @internal */
    public static getRawCount(optionalColumnCount: number) {
        return ColumnInfo.rawColumnCounts[optionalColumnCount];
    }

    /** @internal */
    public static getClass(columnName: ColumnName, ordering: IOrdering, optionalColumnCount: number) {
        const result = [
            ...ColumnInfo.getHidden(columnName, ordering.groupBy, optionalColumnCount),
            ...ColumnInfo.getAlignment(columnName),
            ...ColumnInfo.getPadding(columnName, ordering.groupBy, ordering.otherGroupBys),
            ...ColumnInfo.getTotal(columnName),
        ];

        if (result.length === 0) {
            throw new Error(`Unknown column: ${columnName}`);
        }

        return result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly totalValueName = ColumnInfo.getName("totalValue");
    private static readonly percentName = ColumnInfo.getName("percent");

    private static readonly allColumns: ReadonlyMap<GroupBy, readonly ColumnName[]> = new Map([
        [AssetPropertyNames.type, ColumnInfo.getColumns(AssetPropertyNames.type)],
        [AssetPropertyNames.location, ColumnInfo.getColumns(AssetPropertyNames.location)],
    ]);

    /**
     * From the full list of columns (full, integer and fraction) returned by `getColumns`, contains the number of
     * currently visible columns with the index being the number of currently visible optional full columns. For
     * example, if no optional full columns are currently visible (i.e. index = 0), the first 5 columns of whatever
     * is returned by `getColumns` will be shown. Note that said list contains real table columns
     * as well as "virtual" columns. Examples of real table columns are "totalValueInteger" and "unit" while
     * "totalValue" and "fineness" are virtual columns.
     */
    private static readonly allColumnCounts = [5, 6, 7, 8, 9, 10, 11, 12] as const;

    /**
     * Contains the number of real table columns shown with the index being the number of currently visible optional
     * full columns.
     */
    private static readonly rawColumnCounts = [5, 6, 7, 8, 9, 10, 11, 12] as const;

    private static getName(name: AssetListRowPropertyName) {
        return name;
    }

    private static getColumns(groupBy: GroupBy) {
        const result: ColumnName[] = [
            ColumnInfo.expandName, AssetPropertyNames.type,
            CalculatedAssetPropertyNames.percent,
            ColumnInfo.moreName, ColumnInfo.grandTotalLabelName, CalculatedAssetPropertyNames.totalValue,
            AssetPropertyNames.location, CalculatedAssetPropertyNames.unit,
            Asset.quantityName,
            CalculatedAssetPropertyNames.unitValue,
            AssetPropertyNames.description,
            Asset.finenessName,
        ];

        if (groupBy === AssetPropertyNames.location) {
            result[1] = AssetPropertyNames.location;
            result[6] = AssetPropertyNames.type;
        }

        return result;
    }

    private static getHidden(columnName: ColumnName, groupBy: GroupBy, optionalColumnCount: number) {
        const allColumns = ColumnInfo.allColumns.get(groupBy);

        if (!allColumns) {
            throw new Error("Unknown groupBy!");
        }

        if (allColumns.indexOf(columnName) >= ColumnInfo.allColumnCounts[optionalColumnCount]) {
            // TODO: Can't this be done with one class?
            return ["hidden-sm-and-up", "hidden-xs-only"];
        }

        return [];
    }

    // Obviously the metrics could be improved by breaking the method into multiple parts but doing so would make the
    // code less readable.
    // codebeat:disable[ABC,CYCLO,LOC]
    private static getPadding(columnName: string | undefined, groupBy: string, otherGroupBys: readonly GroupBy[]) {
        const columnPadding = 3;
        const leftClass = `pl-${columnPadding}`;
        const rightClass = `pr-${columnPadding}`;

        switch (columnName) {
            case ColumnInfo.expandName:
                return [leftClass, "pr-2"];
            case groupBy:
                return ["pl-0", rightClass];
            case otherGroupBys[0]:
            case AssetPropertyNames.description:
            case CalculatedAssetPropertyNames.unit:
            case Asset.finenessName:
            case CalculatedAssetPropertyNames.unitValue:
            case Asset.quantityName:
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
    // codebeat:enable[ABC,CYCLO,LOC]

    // Obviously the metrics could be improved by breaking the method into multiple parts but doing so would make the
    // code less readable.
    // codebeat:disable[ABC,CYCLO]
    private static getAlignment(columnName: string | undefined) {
        switch (columnName) {
            case AssetPropertyNames.type:
            case AssetPropertyNames.description:
            case AssetPropertyNames.location:
            case CalculatedAssetPropertyNames.unit:
            case ColumnInfo.grandTotalLabelName:
                return ["text-left"];
            default:
                return ["text-center"];
        }
    }
    // codebeat:enable[ABC,CYCLO]

    private static getTotal(columnName: string | undefined) {
        switch (columnName) {
            case ColumnInfo.totalValueName:
            case ColumnInfo.percentName:
            case ColumnInfo.grandTotalLabelName:
                return ["total"];
            default:
                return [];
        }
    }
}
