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
        const result = new Array<string>(
            ...ColumnInfo.getHidden(columnName, ordering.groupBy, optionalColumnCount),
            ...ColumnInfo.getAlignment(columnName),
            ...ColumnInfo.getPadding(columnName, ordering.groupBy, ordering.otherGroupBys),
            ...ColumnInfo.getTotal(columnName),
        );

        if (result.length === 0) {
            throw new Error(`Unknown column: ${columnName}`);
        }

        return result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly finenessIntegerName = ColumnInfo.getName("finenessInteger");
    private static readonly finenessFractionName = ColumnInfo.getName("finenessFraction");
    private static readonly unitValueIntegerName = ColumnInfo.getName("unitValueInteger");
    private static readonly unitValueFractionName = ColumnInfo.getName("unitValueFraction");
    private static readonly quantityIntegerName = ColumnInfo.getName("quantityInteger");
    private static readonly quantityFractionName = ColumnInfo.getName("quantityFraction");
    private static readonly totalValueIntegerName = ColumnInfo.getName("totalValueInteger");
    private static readonly totalValueFractionName = ColumnInfo.getName("totalValueFraction");
    private static readonly percentIntegerName = ColumnInfo.getName("percentInteger");
    private static readonly percentFractionName = ColumnInfo.getName("percentFraction");

    private static readonly allColumns = new Map<GroupBy, ColumnName[]>([
        [AssetPropertyNames.type, ColumnInfo.getColumns(AssetPropertyNames.type)],
        [AssetPropertyNames.location, ColumnInfo.getColumns(AssetPropertyNames.location)],
    ]);

    /**
     * From the full list of columns (full, integer and fraction) returned by `getColumns`, contains the number of
     * currently visible columns with the index being the number of currently visible optional full columns. For
     * example, if no optional full columns are currently visible (i.e. index = 0), the first 7 columns of whatever
     * is returned by `getColumns` will be shown. Note that said list contains real table columns
     * as well as "virtual" columns. Examples of real table columns are "totalValueInteger" and "unit" while
     * "totalValue" and "fineness" are virtual columns.
     */
    private static readonly allColumnCounts = [ 7, 10, 11, 12, 15, 18, 19, 22 ];

    /**
     * Contains the number of real table columns shown with the index being the number of currently visible optional
     * full columns.
     */
    private static readonly rawColumnCounts = [ 5, 7, 8, 9, 11, 13, 14, 16 ];

    private static getName(name: AssetListRowPropertyName) {
        return name;
    }

    private static getColumns(groupBy: GroupBy) {
        const result: ColumnName[] = [
            ColumnInfo.expandName, AssetPropertyNames.type,
            CalculatedAssetPropertyNames.percent, ColumnInfo.percentIntegerName, ColumnInfo.percentFractionName,
            ColumnInfo.moreName, ColumnInfo.grandTotalLabelName, CalculatedAssetPropertyNames.totalValue,
            ColumnInfo.totalValueIntegerName, ColumnInfo.totalValueFractionName,
            AssetPropertyNames.location, CalculatedAssetPropertyNames.unit,
            Asset.quantityName, ColumnInfo.quantityIntegerName, ColumnInfo.quantityFractionName,
            CalculatedAssetPropertyNames.unitValue, ColumnInfo.unitValueIntegerName, ColumnInfo.unitValueFractionName,
            AssetPropertyNames.description,
            Asset.finenessName, ColumnInfo.finenessIntegerName, ColumnInfo.finenessFractionName,
        ];

        if (groupBy === AssetPropertyNames.location) {
            result[1] = AssetPropertyNames.location;
            result[10] = AssetPropertyNames.type;
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
            return [ "hidden-sm-and-up", "hidden-xs-only" ];
        }

        return [];
    }

    // Obviously the metrics could be improved by breaking the method into multiple parts but doing so would make the
    // code less readable.
    // codebeat:disable[ABC,CYCLO,LOC]
    private static getPadding(columnName: string | undefined, groupBy: string, otherGroupBys: GroupBy[]) {
        const columnPadding = 3;
        const leftClass = `pl-${columnPadding}`;
        const rightClass = `pr-${columnPadding}`;

        switch (columnName) {
            case ColumnInfo.expandName:
                return [ leftClass, "pr-2" ];
            case groupBy:
                return [ "pl-0", rightClass ];
            case otherGroupBys[0]:
            case AssetPropertyNames.description:
            case CalculatedAssetPropertyNames.unit:
            case Asset.finenessName:
            case CalculatedAssetPropertyNames.unitValue:
            case Asset.quantityName:
            case CalculatedAssetPropertyNames.totalValue:
            case ColumnInfo.grandTotalLabelName:
                return [ leftClass, rightClass ];
            case CalculatedAssetPropertyNames.percent:
            case ColumnInfo.finenessIntegerName:
            case ColumnInfo.unitValueIntegerName:
            case ColumnInfo.quantityIntegerName:
            case ColumnInfo.totalValueIntegerName:
            case ColumnInfo.percentIntegerName:
                return [ leftClass, "pr-0" ];
            case ColumnInfo.finenessFractionName:
            case ColumnInfo.unitValueFractionName:
            case ColumnInfo.quantityFractionName:
            case ColumnInfo.totalValueFractionName:
                return [ "pl-0", rightClass ];
            case ColumnInfo.percentFractionName:
                return [ "pl-0", "pr-0" ];
            case ColumnInfo.moreName:
                return [ "pl-1", rightClass ];
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
            case ColumnInfo.finenessFractionName:
            case ColumnInfo.unitValueFractionName:
            case ColumnInfo.quantityFractionName:
            case ColumnInfo.totalValueFractionName:
            case ColumnInfo.percentFractionName:
            case ColumnInfo.grandTotalLabelName:
                return [ "text-xs-left" ];
            case ColumnInfo.finenessIntegerName:
            case ColumnInfo.unitValueIntegerName:
            case ColumnInfo.quantityIntegerName:
            case ColumnInfo.totalValueIntegerName:
            case ColumnInfo.percentIntegerName:
                return [ "text-xs-right" ];
            default:
                return [];
        }
    }
    // codebeat:enable[ABC,CYCLO]

    private static getTotal(columnName: string | undefined) {
        switch (columnName) {
            case CalculatedAssetPropertyNames.totalValue:
            case ColumnInfo.totalValueIntegerName:
            case ColumnInfo.totalValueFractionName:
            case CalculatedAssetPropertyNames.percent:
            case ColumnInfo.percentIntegerName:
            case ColumnInfo.percentFractionName:
            case ColumnInfo.grandTotalLabelName:
                return [ "total" ];
            default:
                return [];
        }
    }
}
