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

import { Component } from "vue-property-decorator";
import { Asset } from "../model/Asset";
import { Model, SortBy } from "../model/Model";
import AssetEditor from "./AssetEditor.vue";
import AssetListRow, { ColumnName } from "./AssetListRow.vue";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

interface IPagination {
    sortBy: SortBy;
    descending: boolean;
    rowsPerPage: -1;
}

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { AssetListRow, AssetEditor } })
/** Implements the asset list UI. */
// tslint:disable-next-line:no-default-export
export default class AssetList extends ComponentBase<Model> {
    /** Provides the information required for sorting and paginating the table. */
    public get pagination(): IPagination {
        return {
            sortBy: this.checkedValue.sort.by, descending: this.checkedValue.sort.descending, rowsPerPage: -1,
        };
    }

    public set pagination(pagination: IPagination) {
        this.checkedValue.sort = { by: pagination.sortBy, descending: pagination.descending };
    }

    public get isLoading() {
        return (this.totalValue === undefined);
    }

    public get totalValueInteger() {
        return Format.integer(this.totalValue, 2);
    }

    public get totalValueFraction() {
        return Format.fraction(this.totalValue, 2);
    }

    /** Provides a value indicating how many optional columns are currently visible. */
    public get optionalColumnCount() {
        return this.optionalColumnCountImpl;
    }

    // tslint:disable-next-line:prefer-function-over-method
    public getHeaderClass(columnName: ColumnName) {
        const result = AssetListRow.getClassImpl(columnName, this.checkedValue.groupBy, this.optionalColumnCount);

        // Sortable columns
        switch (columnName) {
            case Asset.typeName:
            case Asset.descriptionName:
            case Asset.locationName:
            case Asset.totalValueName:
                const sort = this.checkedValue.sort;
                result.push("column", "sortable", sort.descending ? "desc" : "asc");

                if (sort.by === columnName) {
                    result.push("active");
                }

                break;
            default:
        }

        return result;
    }

    // tslint:disable-next-line:prefer-function-over-method
    public getFooterClass(columnName: ColumnName) {
        return AssetListRow.getClassImpl(columnName, this.checkedValue.groupBy, this.optionalColumnCount);
    }

    /** Changes the sorting for the given property. */
    public changeSort(sortBy: SortBy) {
        const currentSort = this.checkedValue.sort;
        this.checkedValue.sort = (currentSort.by === sortBy) ?
            { by: currentSort.by, descending: !currentSort.descending } : { by: sortBy, descending: false };
    }

    public onAdd() {
        this.assetEditor.add();
    }

    public onEdit(asset: Asset) {
        this.assetEditor.edit(asset);
    }

    public onDelete(asset: Asset) {
        this.checkedValue.deleteAsset(asset);
    }

    public mounted() {
        this.timer = setInterval(() => this.onIntervalElapsed(), 100);
    }

    public beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private optionalColumnCountImpl = AssetListRow.maxOptionalColumnCount;

    private timer?: NodeJS.Timer;
    private previousOffset: number = Number.NaN;

    private get totalValue() {
        return this.checkedValue.groups.reduce<number | undefined>(
            (s, a) => s === undefined ? undefined : (a.totalValue === undefined ? undefined : s + a.totalValue), 0);
    }

    private get assetEditor() {
        return this.getControl("editor") as AssetEditor;
    }

    private onIntervalElapsed() {
        // tslint:disable-next-line:no-unsafe-any
        if (this.previousOffset === this.$el.offsetLeft) {
            // tslint:disable-next-line:no-unsafe-any
            if ((this.optionalColumnCountImpl > 0) && (this.$el.offsetLeft < 0)) {
                --this.optionalColumnCountImpl;
            } else if ((this.optionalColumnCountImpl < AssetListRow.maxOptionalColumnCount) &&
                // tslint:disable-next-line:no-unsafe-any
                (this.$el.offsetLeft * 2 > this.$el.offsetWidth /
                    (AssetListRow.requiredColumnCount + this.optionalColumnCountImpl) * 3)) {
                ++this.optionalColumnCountImpl;
            }
        }

        // tslint:disable-next-line:no-unsafe-any
        this.previousOffset = this.$el.offsetLeft;
    }
}
