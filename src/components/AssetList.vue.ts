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

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { AssetListRow, AssetEditor } })
/** Implements the asset list UI. */
// tslint:disable-next-line:no-default-export
export default class AssetList extends ComponentBase<Model> {
    public get totalValueInteger() {
        return Format.integer(this.totalValue, 2);
    }

    public get totalValueFraction() {
        return Format.fraction(this.totalValue, 2);
    }

    /** @internal */
    public add(bundle: AssetBundle) {
        this.checkedValue.addAsset(bundle);
    }

    /** @internal */
    public edit(asset: Asset) {
        (this.getControl("editor") as AssetEditor).edit(asset);
    }

    /** @internal */
    public remove(asset: Asset) {
        this.checkedValue.removeAsset(asset);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private get totalValue() {
        return this.checkedValue.assets.reduce<number | undefined>(
            (s, a) => s === undefined ? a.totalValue : s + (a.totalValue === undefined ? 0 : a.totalValue), undefined);
    }
}
