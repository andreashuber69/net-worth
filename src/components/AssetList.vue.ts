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
import { AssetBundle } from "../model/AssetBundle";
import { Model } from "../model/Model";
import AssetEditor from "./AssetEditor.vue";
import AssetListRow from "./AssetListRow.vue";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

type SortableProperties = "type" | "description" | "location" | "totalValue";
type SortBy = "" | SortableProperties;

interface IPagination {
    sortBy: SortBy;
    descending: boolean;
}

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { AssetListRow, AssetEditor } })
/** Implements the asset list UI. */
// tslint:disable-next-line:no-default-export
export default class AssetList extends ComponentBase<Model> {
    /** Provides the information required for sorting and paginating the table. */
    public pagination: IPagination = { sortBy: "", descending: false };

    /** Provides the current sort direction. */
    public get sortDirection() {
        return this.pagination.descending ? "desc" : "asc";
    }

    public get totalValueInteger() {
        return Format.integer(this.totalValue, 2);
    }

    public get totalValueFraction() {
        return Format.fraction(this.totalValue, 2);
    }

    /** Gets the active status for the given property. */
    public getActive(property: SortableProperties) {
        return this.pagination.sortBy === property ? "active" : "";
    }

    /** Changes the sorting for the given property. */
    public changeSort(property: SortableProperties) {
        if (this.pagination.sortBy === property) {
            if (this.pagination.descending) {
                this.pagination.sortBy = "";
            }

            this.pagination.descending = !this.pagination.descending;
        } else {
            this.pagination.sortBy = property;
            this.pagination.descending = false;
        }
    }

    public onEdit(asset: Asset) {
        (this.getControl("editor") as AssetEditor).edit(asset);
    }

    public onRemove(asset: Asset) {
        this.checkedValue.removeAsset(asset);
    }

    /** @internal */
    public add(bundle: AssetBundle) {
        this.checkedValue.addAsset(bundle);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private get totalValue() {
        return this.checkedValue.assets.reduce<number | undefined>(
            (s, a) => s === undefined ? a.totalValue : s + (a.totalValue === undefined ? 0 : a.totalValue), undefined);
    }
}
