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
import { AssetEditorData } from "./AssetEditorData";
import { AssetInfo } from "./AssetInfo";
import { ComponentBase } from "./ComponentBase";
import { WeightInfo } from "./WeightInfo";

// tslint:disable-next-line:no-unsafe-any
@Component
// tslint:disable-next-line:no-default-export
export default class AssetEditor extends ComponentBase<Model> {
    public readonly infos = [
        new AssetInfo(
            "Bitcoin Wallet", true, AssetEditor.cryptoDescriptionHint, true, AssetEditor.cryptoLocationHint,
            true, false, false, false, true, false, AssetEditor.cryptoQuantityHint, 8),
        new AssetInfo(
            "Silver", true, AssetEditor.pmDescriptionHint, true, AssetEditor.pmLocationHint,
            false, true, true, true, true, true, AssetEditor.pmQuantityHint, 0),
    ];

    public readonly weightUnits = Array.from(AssetEditor.getWeightUnits());
    public isOpen = false;
    public isValid = true;
    public isGlobal = false;

    public info = AssetEditor.noInfo;
    public data = new AssetEditorData();

    public validate(ref: string) {
        const control = this.getControl(ref);

        if (!control) {
            return true;
        }

        // TODO: This is a workaround for #4, remove as soon as the associated bug has been fixed in vuetify.
        // tslint:disable-next-line:no-unsafe-any
        if (control.$vnode.tag && control.$vnode.tag.endsWith("v-select") &&
            !AssetEditor.isFilledSelect(control, ref)) {
            return "Please fill out this field.";
        }

        if (!this.info.isQuantityRequired && this.isGlobal && ((ref === "address") || (ref === "quantity")) &&
            ((this.data.address === "") === (this.data.quantity === ""))) {
            return "Please fill out either the Address or the Quantity.";
        }

        // TODO: no-unnecessary-type-assertion is probably a false positive, see
        // https://github.com/palantir/tslint/issues/3540
        // tslint:disable-next-line:no-unsafe-any no-unnecessary-type-assertion
        return (control.$refs.input as HTMLInputElement).validationMessage || true;
    }

    public save() {
        this.isGlobal = true;

        try {
            // tslint:disable-next-line:no-unsafe-any
            if ((this.getControl("form") as any).validate()) {
                this.isOpen = false;
            }
        } finally {
            this.isGlobal = false;
        }
    }

    public reset() {
        // tslint:disable-next-line:no-unsafe-any
        (this.getControl("form") as any).reset();
        this.data = new AssetEditorData();
        this.info = AssetEditor.noInfo;
    }

    public cancel() {
        this.isOpen = false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly cryptoDescriptionHint =
        "The purpose of the wallet, e.g. 'Spending', 'Savings', 'Cold Storage'.";
    private static readonly cryptoLocationHint =
        "The location of the wallet, e.g. 'Mobile Phone', 'Hardware Wallet', 'Safety Deposit Box'.";
    private static readonly cryptoQuantityHint = "The amount in the wallet.";

    private static readonly pmDescriptionHint = "The shape of the items, e.g. 'Coins', 'Bars'.";
    private static readonly pmLocationHint = "The location, e.g. 'Safe', 'Safety Deposit Box'.";
    private static readonly pmQuantityHint = "The number of items.";
    private static readonly noInfo =
        new AssetInfo("", false, "", false, "", false, false, false, false, false, false, "", 0);

    private static * getWeightUnits() {
        for (const weightUnitProperty in WeightUnit) {
            if (Number.parseFloat(weightUnitProperty)) {
                const weightUnit = Number.parseFloat(weightUnitProperty) as WeightUnit;
                yield new WeightInfo(Weight.abbreviate(weightUnit), weightUnit);
            }
        }
    }

    private static isFilledSelect(control: Vue, ref: string) {
        const value = (control as any).value;

        switch (ref) {
            case "type":
                // tslint:disable-next-line:no-unsafe-any
                return !!(value as AssetInfo).type;
            case "weightUnit":
                // tslint:disable-next-line:no-unsafe-any
                return !!(value as WeightInfo).abbreviation;
            default:
                return "Unknown select";
        }
    }

    private getControl(ref: string) {
        // TODO: no-unnecessary-type-assertion is probably a false positive, see
        // https://github.com/palantir/tslint/issues/3540
        // tslint:disable-next-line:no-unsafe-any no-unnecessary-type-assertion
        return this.$refs[ref] as Vue;
    }
}
