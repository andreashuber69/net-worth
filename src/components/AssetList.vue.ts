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
import { Asset, SortBy } from "../model/Asset";
import { Model } from "../model/Model";
import { Ordering } from "../model/Ordering";
import AssetEditor from "./AssetEditor.vue";
import AssetListRow, { ColumnName } from "./AssetListRow.vue";
import { ColumnInfo } from "./ColumnInfo";
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
            sortBy: this.checkedValue.ordering.sort.by,
            descending: this.checkedValue.ordering.sort.descending,
            rowsPerPage: -1,
        };
    }

    public set pagination(pagination: IPagination) {
        this.checkedValue.ordering.sort = { by: pagination.sortBy, descending: pagination.descending };
    }

    public get isLoading() {
        return (this.checkedValue.grandTotalValue === undefined);
    }

    public get grandTotalValueInteger() {
        return Format.integer(this.checkedValue.grandTotalValue, 2);
    }

    public get grandTotalValueFraction() {
        return Format.fraction(this.checkedValue.grandTotalValue, 2);
    }

    /** Provides a value indicating how many optional columns are currently visible. */
    public get optionalColumnCount() {
        return this.optionalColumnCountImpl;
    }

    public get grandTotalLabelColumnCount() {
        // This is the minimal column span for the grand total label.
        let result = 2;

        if (this.optionalColumnCount >= 1) {
            // We need to add to the minimum the number of columns that are added *after* the total value column has
            // appeared.
            result += (ColumnInfo.getRawCount(this.optionalColumnCount) - ColumnInfo.getRawCount(1));
        }

        return result;
    }

    // tslint:disable-next-line:prefer-function-over-method
    public getHeaderClass(columnName: ColumnName) {
        const result = ColumnInfo.getClass(columnName, this.checkedValue.ordering, this.optionalColumnCount);

        // Sortable columns
        if (Ordering.isSortBy(columnName)) {
            const sort = this.checkedValue.ordering.sort;
            result.push("column", "sortable", sort.descending ? "desc" : "asc");

            if (sort.by === columnName) {
                result.push("active");
            }
        }

        return result;
    }

    // tslint:disable-next-line:prefer-function-over-method
    public getFooterClass(columnName: ColumnName) {
        return ColumnInfo.getClass(columnName, this.checkedValue.ordering, this.optionalColumnCount);
    }

    /** Changes the sorting for the given property. */
    public changeSort(sortBy: SortBy) {
        const currentSort = this.checkedValue.ordering.sort;
        this.checkedValue.ordering.sort = (currentSort.by === sortBy) ?
            { by: currentSort.by, descending: !currentSort.descending } : { by: sortBy, descending: false };
    }

    public async onAdd() {
        const newAsset = await this.assetEditor.showDialog(this.checkedValue);

        if (newAsset) {
            this.checkedValue.addAsset(newAsset);
        }
    }

    public async onEdit(asset: Asset) {
        const changedAsset = await this.assetEditor.showDialog(this.checkedValue, asset);

        if (changedAsset) {
            this.checkedValue.replaceAsset(asset, changedAsset);
        }
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

    private optionalColumnCountImpl = ColumnInfo.maxOptionalCount;

    private timer?: NodeJS.Timer;
    private previousOffset: number = Number.NaN;

    private get assetEditor() {
        return this.getControl("editor") as AssetEditor;
    }

    private onIntervalElapsed() {
        // tslint:disable-next-line:no-unsafe-any
        if (this.previousOffset === this.$el.offsetLeft) {
            // tslint:disable-next-line:no-unsafe-any
            if ((this.optionalColumnCountImpl > 0) && (this.$el.offsetLeft < 0)) {
                --this.optionalColumnCountImpl;
            } else if ((this.optionalColumnCountImpl < ColumnInfo.maxOptionalCount) &&
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
