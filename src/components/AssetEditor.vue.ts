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

import { Component, Vue } from "vue-property-decorator";
import { Model } from "../model/Model";
import { Weight, WeightUnit } from "../model/WeightUnit";
import { AssetInfo } from "./AssetInfo";
import { ComponentBase } from "./ComponentBase";
import { WeightInfo } from "./WeightInfo";

// tslint:disable-next-line:no-unsafe-any
@Component
// tslint:disable-next-line:no-default-export
export default class AssetEditor extends ComponentBase<Model> {
    public readonly infos = [
        new AssetInfo(
            "BTC", true, AssetEditor.cryptoDescriptionHint, true,
            AssetEditor.cryptoLocationHint, false, false, false, true, AssetEditor.cryptoQuantityHint, 8),
        new AssetInfo(
            "Silver", true, AssetEditor.pmDescriptionHint, true,
            AssetEditor.pmLocationHint, true, true, true, true, AssetEditor.pmQuantityHint, 0),
    ];

    public readonly weightUnits = Array.from(AssetEditor.getWeightUnits());
    public readonly finenesses = [ 0.999, 0.9999, 0.99999, 0.9 ];
    public isOpen = false;

    public info = new AssetInfo("", false, "", false, "", false, false, false, false, "", 0);
    public description = "";
    public descriptionMsg = new Array<string>();
    public location = "";
    public locationMsg = new Array<string>();
    // tslint:disable-next-line:no-null-keyword
    public weight: number | null = null;
    public weightMsg = new Array<string>();
    public weightUnit = new WeightInfo("", 0);
    public weightUnitMsg = new Array<string>();
    // tslint:disable-next-line:no-null-keyword
    public fineness: number | null = null;
    public finenessMsg = new Array<string>();
    // tslint:disable-next-line:no-null-keyword
    public quantity: number | null = null;
    public quantityMsg = new Array<string>();

    public validate(ref: string) {
        // no-unnecessary-type-assertion is probably a false positive, see
        // https://github.com/palantir/tslint/issues/3540
        // tslint:disable-next-line:no-unsafe-any no-unnecessary-type-assertion
        return ((this.$refs[ref] as Vue).$refs.input as HTMLInputElement).validationMessage || true;
    }

    // // public close() {
    // // }

    // // public save() {
    // // }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly cryptoDescriptionHint =
        "The purpose of the wallet, e.g. 'Cold Storage', 'Savings', 'Spending', ...";
    private static readonly cryptoLocationHint = "The location of the wallet, e.g. Mobile Phone, Hardware Wallet, ...";
    private static readonly cryptoQuantityHint = "The amount";

    private static readonly pmDescriptionHint = "The shape of the precious metal, e.g. 'Coins', 'Bars', ...";
    private static readonly pmLocationHint = "E.g. Safe, Safety Deposit Box, ...";

    private static readonly pmQuantityHint = "The number of precious metal items";

    private static * getWeightUnits() {
        for (const weightUnitProperty in WeightUnit) {
            if (Number.parseFloat(weightUnitProperty)) {
                const weightUnit = Number.parseFloat(weightUnitProperty) as WeightUnit;
                yield new WeightInfo(Weight.abbreviate(weightUnit), weightUnit);
            }
        }
    }
}
