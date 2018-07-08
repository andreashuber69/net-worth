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

import { Component, Prop } from "vue-property-decorator";
import { Asset, AssetDisplayPropertyName, GroupBy } from "../model/Asset";
import { PreciousMetalAssetInputInfo } from "../model/PreciousMetalAssetInputInfo";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

// tslint:disable-next-line:ban-types
type PropertyNames<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];
type Diff<T, U> = T extends U ? never : T;
type AssetListRowPropertyName = Diff<PropertyNames<AssetListRow>, PropertyNames<ComponentBase<Asset>>>;

// tslint:disable-next-line:no-unsafe-any
@Component
/**
 * Implements the UI for a single row of the asset list.
 * @description Most of the members split asset properties into the integral and fractional parts. This is necessary
 * so that the UI can justify the values on the decimal point.
 */
// tslint:disable-next-line:no-default-export
export default class AssetListRow extends ComponentBase<Asset> {
    /** Gets the number of required columns. */
    public static get requiredColumnCount() {
        return 2;
    }

    /** Provides the maximum number of optional columns that can be displayed. */
    public static get maxOptionalColumnCount() {
        return AssetListRow.columnNameLengths.length - 1;
    }

    /** @internal */
    public static readonly expandName = "expand";

    /** @internal */
    public static readonly moreName = "more";

    /** @internal */
    public static readonly grandTotalLabelName = "grandTotalLabel";

    /** @internal */
    public static getClassImpl(columnName: ColumnName, groupBy: GroupBy, optionalColumnCount: number) {
        const result = new Array<string>();

        // Hiding
        const allColumns = AssetListRow.allColumns.get(groupBy);

        if (!allColumns) {
            throw new Error("Unknown groupBy!");
        }

        if (allColumns.indexOf(columnName) >= this.columnNameLengths[optionalColumnCount]) {
            result.push("hidden-sm-and-up", "hidden-xs-only");
        }

        // Alignment
        switch (columnName) {
            case Asset.typeName:
            case Asset.descriptionName:
            case Asset.locationName:
            case Asset.unitName:
            case this.finenessFractionName:
            case this.unitValueFractionName:
            case this.quantityFractionName:
            case this.totalValueFractionName:
            case this.grandTotalLabelName:
                result.push("text-xs-left");
                break;
            case this.finenessIntegerName:
            case this.unitValueIntegerName:
            case this.quantityIntegerName:
            case this.totalValueIntegerName:
                result.push("text-xs-right");
                break;
            default:
        }

        const columnPadding = 4;
        const leftClass = `pl-${columnPadding}`;
        const rightClass = `pr-${columnPadding}`;

        // Padding
        switch (columnName) {
            case this.expandName:
                result.push(leftClass, "pr-2");
                break;
            case Asset.typeName:
                result.push("pl-0", rightClass);
                break;
            case Asset.descriptionName:
            case Asset.locationName:
            case Asset.unitName:
            case Asset.finenessName:
            case Asset.unitValueName:
            case Asset.quantityName:
            case this.grandTotalLabelName:
                result.push(leftClass, rightClass);
                break;
            case Asset.totalValueName:
                result.push(leftClass, "pr-0");
                break;
            case this.finenessIntegerName:
            case this.unitValueIntegerName:
            case this.quantityIntegerName:
            case this.totalValueIntegerName:
                result.push(leftClass, "pr-0");
                break;
            case this.finenessFractionName:
            case this.unitValueFractionName:
            case this.quantityFractionName:
                result.push("pl-0", rightClass);
                break;
            case this.totalValueFractionName:
                result.push("pl-0", "pr-0");
                break;
            case this.moreName:
                result.push("pl-1", rightClass);
                break;
            default:
        }

        // Total
        switch (columnName) {
            case Asset.totalValueName:
            case this.totalValueIntegerName:
            case this.totalValueFractionName:
            case this.grandTotalLabelName:
                result.push("total");
                break;
            default:
        }

        if (result.length === 0) {
            throw new Error("Unknown column");
        }

        return result;
    }

    // TODO: This should be a number
    @Prop()
    public visibleColumnCount: undefined;

    public get finenessInteger() {
        return this.checkedValue.fineness === undefined ? "" : Math.trunc(this.checkedValue.fineness).toString();
    }

    public get finenessFraction() {
        return this.checkedValue.fineness === undefined ?
            "" : this.checkedValue.fineness.toLocaleString(undefined, AssetListRow.finenessFormatOptions).substr(1);
    }

    public get unitValueInteger() {
        return Format.integer(this.checkedValue.unitValue, 2);
    }

    public get unitValueFraction() {
        return Format.fraction(this.checkedValue.unitValue, 2);
    }

    public get quantityInteger() {
        return Format.integer(this.checkedValue.quantity, this.checkedValue.displayDecimals);
    }

    public get quantityFraction() {
        return Format.fraction(this.checkedValue.quantity, this.checkedValue.displayDecimals);
    }

    public get totalValueInteger() {
        return Format.integer(this.checkedValue.totalValue, 2);
    }

    public get totalValueFraction() {
        return Format.fraction(this.checkedValue.totalValue, 2);
    }

    // tslint:disable-next-line:prefer-function-over-method
    public getClass(columnName: ColumnName) {
        return AssetListRow.getClassImpl(columnName, this.checkedValue.parent.groupBy, this.checkedOptionalColumnCount);
    }

    /** Instructs the asset group to be expanded/collapsed. */
    public onRowClicked(event: MouseEvent) {
        this.checkedValue.expand();
    }

    /** Instructs the parent UI element to open the asset editor dialog with the given asset. */
    public onEditClicked(event: MouseEvent) {
        // tslint:disable-next-line:no-unsafe-any
        this.$emit("edit", this.checkedValue);
    }

    /** Instructs the parent UI element to delete the given asset from the list. */
    public onDeleteClicked(event: MouseEvent) {
        // tslint:disable-next-line:no-unsafe-any
        this.$emit("delete", this.checkedValue);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly finenessIntegerName = AssetListRow.getName("finenessInteger");
    private static readonly finenessFractionName = AssetListRow.getName("finenessFraction");
    private static readonly unitValueIntegerName = AssetListRow.getName("unitValueInteger");
    private static readonly unitValueFractionName = AssetListRow.getName("unitValueFraction");
    private static readonly quantityIntegerName = AssetListRow.getName("quantityInteger");
    private static readonly quantityFractionName = AssetListRow.getName("quantityFraction");
    private static readonly totalValueIntegerName = AssetListRow.getName("totalValueInteger");
    private static readonly totalValueFractionName = AssetListRow.getName("totalValueFraction");

    private static readonly finenessFormatOptions = {
        maximumFractionDigits: PreciousMetalAssetInputInfo.finenessDigits,
        minimumFractionDigits: 1,
        useGrouping: true };

    private static readonly allColumns = new Map<GroupBy, ColumnName[]>([
        [Asset.typeName, AssetListRow.getColumns(Asset.typeName)],
        [Asset.locationName, AssetListRow.getColumns(Asset.locationName)],
    ]);

    private static readonly columnNameLengths = [7, 8, 9, 12, 15, 16, 19];

    private static getColumns(groupBy: GroupBy) {
        const result: ColumnName[] = [
            AssetListRow.expandName,
            Asset.totalValueName, AssetListRow.totalValueIntegerName, AssetListRow.totalValueFractionName,
            AssetListRow.moreName, AssetListRow.grandTotalLabelName,
            Asset.typeName, Asset.locationName, Asset.unitName,
            Asset.quantityName, AssetListRow.quantityIntegerName, AssetListRow.quantityFractionName,
            Asset.unitValueName, AssetListRow.unitValueIntegerName, AssetListRow.unitValueFractionName,
            Asset.descriptionName,
            Asset.finenessName, AssetListRow.finenessIntegerName, AssetListRow.finenessFractionName,
        ];

        if (groupBy === Asset.locationName) {
            result[6] = Asset.locationName;
            result[7] = Asset.typeName;
        }

        return result;
    }

    private static getName<T extends keyof AssetListRow>(name: T) {
        return name;
    }

    private get checkedOptionalColumnCount() {
        if (this.visibleColumnCount as any === undefined) {
            throw new Error("No optional column count set!");
        }

        return this.visibleColumnCount as any as number;
    }
}

export type ColumnName = AssetDisplayPropertyName | AssetListRowPropertyName |
    typeof AssetListRow.expandName | typeof AssetListRow.moreName | typeof AssetListRow.grandTotalLabelName;
