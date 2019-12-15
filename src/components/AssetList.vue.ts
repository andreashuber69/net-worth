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

import { Component } from "vue-property-decorator";

import { Asset } from "../model/Asset";
import { Model } from "../model/Model";
import { Ordering } from "../model/Ordering";
import { SortBy } from "../model/validation/schemas/SortBy.schema";

// tslint:disable-next-line:no-default-import
import AssetEditor from "./AssetEditor.vue";
// tslint:disable-next-line:no-default-import
import AssetListRow, { ColumnName } from "./AssetListRow.vue";
import { ColumnInfo } from "./ColumnInfo";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

@Component({ components: { AssetListRow, AssetEditor } })
/** Implements the asset list UI. */
// tslint:disable-next-line:no-default-export
export default class AssetList extends ComponentBase<Model> {
    public readonly itemsPerPage = -1;

    public get sortBy() {
        return this.checkedValue.assets.ordering.sort.by;
    }

    public set sortBy(sortBy: SortBy) {
        this.checkedValue.assets.ordering.sort = { by: sortBy, descending: this.sortDesc };
    }

    public get sortDesc() {
        return this.checkedValue.assets.ordering.sort.descending;
    }

    public set sortDesc(sortDesc: boolean) {
        this.checkedValue.assets.ordering.sort = { by: this.sortBy, descending: sortDesc };
    }

    public get isLoading() {
        return (this.checkedValue.assets.grandTotalValue === undefined);
    }

    public get grandTotalValueInteger() {
        return Format.integer(this.checkedValue.assets.grandTotalValue, 2);
    }

    public get grandTotalValueFraction() {
        return Format.fraction(this.checkedValue.assets.grandTotalValue, 2);
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

    public getHeaderClass(columnName: ColumnName) {
        const result = ColumnInfo.getClass(columnName, this.checkedValue.assets.ordering, this.optionalColumnCount);

        // Sortable columns
        if (Ordering.isSortBy(columnName)) {
            const sort = this.checkedValue.assets.ordering.sort;
            result.push("column", "sortable", sort.descending ? "desc" : "asc");

            if (sort.by === columnName) {
                result.push("active");
            }
        }

        return result;
    }

    public getFooterClass(columnName: ColumnName) {
        return ColumnInfo.getClass(columnName, this.checkedValue.assets.ordering, this.optionalColumnCount);
    }

    /** Changes the sorting for the given property. */
    public changeSort(sortBy: SortBy) {
        const currentSort = this.checkedValue.assets.ordering.sort;
        this.checkedValue.assets.ordering.sort = (currentSort.by === sortBy) ?
            { by: currentSort.by, descending: !currentSort.descending } : { by: sortBy, descending: false };
    }

    public async onAdd() {
        const newAsset = await this.assetEditor.showDialog(this.checkedValue);

        if (newAsset) {
            this.checkedValue.assets.add(newAsset);
        }
    }

    public async onEdit(asset: Asset) {
        const changedAsset = await this.assetEditor.showDialog(this.checkedValue, asset);

        if (changedAsset) {
            this.checkedValue.assets.replace(asset, changedAsset);
        }
    }

    public onDelete(asset: Asset) {
        this.checkedValue.assets.delete(asset);
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
        const element = this.$el as HTMLElement;

        if (this.previousOffset === element.offsetLeft) {
            if ((this.optionalColumnCountImpl > 0) && (element.offsetLeft < 0)) {
                --this.optionalColumnCountImpl;
            } else if ((this.optionalColumnCountImpl < ColumnInfo.maxOptionalCount) &&
                (element.offsetLeft * 2 > element.offsetWidth /
                    (AssetListRow.requiredColumnCount + this.optionalColumnCountImpl) * 3)) {
                ++this.optionalColumnCountImpl;
            }
        }

        this.previousOffset = element.offsetLeft;
    }
}
