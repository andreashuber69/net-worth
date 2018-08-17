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
import { ColumnInfo } from "./ColumnInfo";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

// tslint:disable-next-line:ban-types
type PropertyNames<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];
type Diff<T, U> = T extends U ? never : T;
export type AssetListRowPropertyName = Diff<PropertyNames<AssetListRow>, PropertyNames<ComponentBase<Asset>>>;

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
        return 3;
    }

    @Prop()
    public visibleColumnCount?: number;

    public get groupBy() {
        return this.checkedValue.parent.groupBy;
    }

    public get groupByContent() {
        return this.checkedValue[this.groupBy];
    }

    public get groupByHint() {
        return this.getHint(this.groupBy);
    }

    public get otherGroupBys() {
        return this.checkedValue.parent.otherGroupBys;
    }

    public get otherGroupByContents() {
        return this.otherGroupBys.map((g) => this.checkedValue[g]);
    }

    public get otherGroupByHints() {
        return this.otherGroupBys.map((g) => this.getHint(g));
    }

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

    public get percentInteger() {
        return Format.integer(this.checkedValue.percent, 1);
    }

    public get percentFraction() {
        return Format.fraction(this.checkedValue.percent, 1);
    }

    public getClass(columnName: ColumnName) {
        return ColumnInfo.getClass(
            columnName, this.checkedValue.parent.groupBy,
            this.checkedValue.parent.otherGroupBys, this.checkedOptionalColumnCount);
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

    private static readonly finenessFormatOptions = {
        maximumFractionDigits: PreciousMetalAssetInputInfo.finenessDigits,
        minimumFractionDigits: 1,
        useGrouping: true };

    private getHint(groupBy: GroupBy) {
        switch (groupBy) {
            case "type":
                return "";
            case "location":
                return this.checkedValue.locationHint;
            default:
                throw new Error("Unknown groupBy!");
        }
    }

    private get checkedOptionalColumnCount() {
        if (this.visibleColumnCount === undefined) {
            throw new Error("No optional column count set!");
        }

        return this.visibleColumnCount;
    }
}

export type ColumnName = AssetDisplayPropertyName | AssetListRowPropertyName |
    typeof ColumnInfo.expandName | typeof ColumnInfo.moreName | typeof ColumnInfo.grandTotalLabelName;
