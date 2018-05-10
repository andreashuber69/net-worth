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
import { AssetBundle } from "../model/AssetBundle";
import { Model } from "../model/Model";
import { SilverAsset } from "../model/SilverAsset";
import { WeightUnit } from "../model/WeightUnit";
import { AssetEditor } from "./AssetEditor";
import AssetListRow from "./AssetListRow.vue";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { AssetListRow } })
// tslint:disable-next-line:no-default-export
export default class AssetList extends ComponentBase<Model> {
    public dialog = false;
    public readonly editor = new AssetEditor();

    public weightMsg: string[] = [];

    public get totalValueInteger() {
        return Format.integer(this.totalValue, 2);
    }

    public get totalValueFraction() {
        return Format.fraction(this.totalValue, 2);
    }

    public add() {
        return this.model.add(
            new AssetBundle(new SilverAsset(this.model, "Home", "Bars", 1, WeightUnit.Kilogram, 0.999, 3)));
    }

    // tslint:disable-next-line:prefer-function-over-method
    public validate(event: any) {
        // tslint:disable-next-line:no-unsafe-any
        const message = (event.target as HTMLInputElement).validationMessage;

        return message ? [ message ] : [];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private get totalValue() {
        return this.model.assets.reduce<number | undefined>(
            (s, a) => s === undefined ? a.totalValue : s + (a.totalValue === undefined ? 0 : a.totalValue), undefined);
    }
}
