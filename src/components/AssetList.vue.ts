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

import { Component, Prop, Vue } from "vue-property-decorator";
import { AssetBundle } from "./AssetBundle";
import AssetListRow from "./AssetListRow.vue";
import { Format } from "./Format";
import { Model } from "./Model";
import { WeightUnit } from "./PreciousMetalAsset";
import { SilverAsset } from "./SilverAsset";

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { AssetListRow } })
// tslint:disable-next-line:no-default-export no-unsafe-any
export default class AssetList extends Vue {
    @Prop()
    public modelProp?: Model;

    public get model() {
        if (!this.modelProp) {
            throw new Error("No model set.");
        }

        return this.modelProp;
    }

    public get totalValueInteger() {
        return Format.integer(this.totalValue, 2);
    }

    public get totalValueFraction() {
        return Format.fraction(this.totalValue, 2);
    }

    public add() {
        return this.model.add(
            new AssetBundle(new SilverAsset(this.model, "Home", "Bars", WeightUnit.Kilogram, 1, 0.999, 3)));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private get totalValue() {
        return this.model.assets.reduce<number | undefined>(
            (s, a) => s === undefined ? a.totalValue : s + (a.totalValue === undefined ? 0 : a.totalValue), undefined);
    }
}
