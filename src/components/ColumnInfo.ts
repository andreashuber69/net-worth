// Copyright (C) 2018 Andreas Huber Dönni
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

import { Asset, GroupBy } from "../model/Asset";
import { AssetListRowPropertyName, ColumnName } from "./AssetListRow.vue";

export class ColumnInfo {
    /** Provides the maximum number of optional columns that can be displayed. */
    public static get maxOptionalCount() {
        return this.allColumnCounts.length - 1;
    }

    /** @internal */
    public static readonly expandName = "expand";

    /** @internal */
    public static readonly moreName = "more";

    /** @internal */
    public static readonly grandTotalLabelName = "grandTotalLabel";

    /** @internal */
    public static getRawCount(optionalColumnCount: number) {
        return this.rawColumnCounts[optionalColumnCount];
    }

    /** @internal */
    public static getClass(
        columnName: ColumnName, groupBy: GroupBy, otherGroupBys: GroupBy[], optionalColumnCount: number) {
        const result = new Array<string>();

        this.addHidden(result, columnName, groupBy, optionalColumnCount);
        this.addAlignment(result, columnName);
        result.push(...this.getPadding(columnName, groupBy, otherGroupBys));
        this.addTotal(result, columnName);

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
        [Asset.typeName, ColumnInfo.getColumns(Asset.typeName)],
        [Asset.locationName, ColumnInfo.getColumns(Asset.locationName)],
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
            this.expandName, Asset.typeName,
            Asset.percentName, this.percentIntegerName, this.percentFractionName,
            this.moreName, this.grandTotalLabelName,
            Asset.totalValueName, this.totalValueIntegerName, this.totalValueFractionName,
            Asset.locationName, Asset.unitName,
            Asset.quantityName, this.quantityIntegerName, this.quantityFractionName,
            Asset.unitValueName, this.unitValueIntegerName, this.unitValueFractionName,
            Asset.descriptionName,
            Asset.finenessName, this.finenessIntegerName, this.finenessFractionName,
        ];

        if (groupBy === Asset.locationName) {
            result[1] = Asset.locationName;
            result[10] = Asset.typeName;
        }

        return result;
    }

    private static addHidden(result: string[], columnName: ColumnName, groupBy: GroupBy, optionalColumnCount: number) {
        const allColumns = this.allColumns.get(groupBy);

        if (!allColumns) {
            throw new Error("Unknown groupBy!");
        }

        if (allColumns.indexOf(columnName) >= this.allColumnCounts[optionalColumnCount]) {
            // TODO: Can't this be done with one class?
            result.push("hidden-sm-and-up", "hidden-xs-only");
        }
    }

    // Obviously the metrics could be improved by breaking the method into multiple parts but doing so would make the
    // code less readable.
    // codebeat:disable[abc,cyclo,loc]
    private static getPadding(columnName: string | undefined, groupBy: string, otherGroupBys: GroupBy[]) {
        const columnPadding = 3;
        const leftClass = `pl-${columnPadding}`;
        const rightClass = `pr-${columnPadding}`;

        switch (columnName) {
            case this.expandName:
                return [ leftClass, "pr-2" ];
            case groupBy:
                return [ "pl-0", rightClass ];
            case otherGroupBys[0]:
            case Asset.descriptionName:
            case Asset.unitName:
            case Asset.finenessName:
            case Asset.unitValueName:
            case Asset.quantityName:
            case Asset.totalValueName:
            case this.grandTotalLabelName:
                return [ leftClass, rightClass ];
            case Asset.percentName:
            case this.finenessIntegerName:
            case this.unitValueIntegerName:
            case this.quantityIntegerName:
            case this.totalValueIntegerName:
            case this.percentIntegerName:
                return [ leftClass, "pr-0" ];
            case this.finenessFractionName:
            case this.unitValueFractionName:
            case this.quantityFractionName:
            case this.totalValueFractionName:
                return [ "pl-0", rightClass ];
            case this.percentFractionName:
                return [ "pl-0", "pr-0" ];
            case this.moreName:
                return [ "pl-1", rightClass ];
            default:
                return [];
        }
    }
    // codebeat:enable[abc,cyclo,loc]

    private static addAlignment(result: string[], columnName: string | undefined) {
        switch (columnName) {
            case Asset.typeName:
            case Asset.descriptionName:
            case Asset.locationName:
            case Asset.unitName:
            case this.finenessFractionName:
            case this.unitValueFractionName:
            case this.quantityFractionName:
            case this.totalValueFractionName:
            case this.percentFractionName:
            case this.grandTotalLabelName:
                result.push("text-xs-left");
                break;
            case this.finenessIntegerName:
            case this.unitValueIntegerName:
            case this.quantityIntegerName:
            case this.totalValueIntegerName:
            case this.percentIntegerName:
                result.push("text-xs-right");
                break;
            default:
        }
    }

    private static addTotal(result: string[], columnName: string | undefined) {
        switch (columnName) {
            case Asset.totalValueName:
            case this.totalValueIntegerName:
            case this.totalValueFractionName:
            case Asset.percentName:
            case this.percentIntegerName:
            case this.percentFractionName:
            case this.grandTotalLabelName:
                result.push("total");
                break;
            default:
        }
    }
}
