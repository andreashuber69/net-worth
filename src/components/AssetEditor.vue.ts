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
import { Model } from "../model/Model";
import { SilverAsset } from "../model/SilverAsset";
import { Weight, WeightUnit } from "../model/WeightUnit";
import { AssetInfo } from "./AssetInfo";
import { ComponentBase } from "./ComponentBase";
import { WeightInfo } from "./WeightInfo";

// tslint:disable-next-line:no-unsafe-any
@Component
// tslint:disable-next-line:no-default-export
export default class AssetEditor extends ComponentBase<Model> {
    public readonly infos = [
        new AssetInfo("BTC", true, true, false, false, false, true, 8),
        new AssetInfo("Silver", true, true, true, true, true, true, 0),
    ];

    public readonly weightUnits = Array.from(AssetEditor.getWeightUnits());
    public readonly finenesses = [ 0.999, 0.9999, 0.99999, 0.9 ];
    public isDialogOpen = false;

    public info = new AssetInfo("", false, false, false, false, false, false, 0);
    public description?: string;
    public descriptionMsg = new Array<string>();
    public location?: string;
    public locationMsg = new Array<string>();
    public weight?: number;
    public weightMsg = new Array<string>();
    public weightUnit = new WeightInfo("", 0);
    public weightUnitMsg = new Array<string>();
    public fineness?: number;
    public finenessMsg = new Array<string>();
    public quantity?: number;
    public quantityMsg = new Array<string>();

    // tslint:disable-next-line:prefer-function-over-method
    public validate(event: any) {
        // tslint:disable-next-line:no-unsafe-any
        const result = (event.target as HTMLInputElement).validationMessage;

        return result ? [ result ] : [];
    }

    public close() {
    }

    public save() {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static * getWeightUnits() {
        for (const weightUnitProperty in WeightUnit) {
            if (Number.parseFloat(weightUnitProperty)) {
                const weightUnit = Number.parseFloat(weightUnitProperty) as WeightUnit;
                yield new WeightInfo(Weight.abbreviate(weightUnit), weightUnit);
            }
        }
    }
}
