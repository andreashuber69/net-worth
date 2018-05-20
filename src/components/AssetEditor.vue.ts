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
import { Asset } from "../model/Asset";
import { AssetBundle } from "../model/AssetBundle";
import { BtcWallet } from "../model/BtcWallet";
import { Model } from "../model/Model";
import { SilverAsset } from "../model/SilverAsset";
import { WeightUnit, WeightUnitConverter } from "../model/WeightUnit";
import { AssetEditorData } from "./AssetEditorData";
import { IAssetInfo } from "./AssetInfo";
import { AssetProperties } from "./AssetProperties";
import { ComponentBase } from "./ComponentBase";
import { CryptoWalletInfo } from "./CryptoWalletInfo";
import { NoAssetInfo } from "./NoAssetInfo";
import { PreciousMetalAssetInfo } from "./PreciousMetalAssetInfo";
import { WeightInfo } from "./WeightInfo";

// tslint:disable-next-line:no-unsafe-any
@Component
/** Implements the dialog used to edit assets. */
// tslint:disable-next-line:no-default-export
export default class AssetEditor extends ComponentBase<Model> {
    /** Provides the list of the possible asset types. */
    public readonly infos: IAssetInfo[] = [
        new CryptoWalletInfo("Bitcoin Wallet", 8, BtcWallet),
        new PreciousMetalAssetInfo("Silver", 0, SilverAsset),
    ];

    /** Provides the list of the possible weight units */
    public readonly weightUnits = Array.from(AssetEditor.getWeightUnits());

    /** Provides a value indicating whether the asset editor is currently open. */
    public isOpen = false;

    /** Provides the title of the asset editor. */
    public get title() {
        return this.editedAsset ? "Edit Asset" : "New Asset";
    }

    /** Provides the currently selected asset type. */
    public info: IAssetInfo = new NoAssetInfo();

    /** Provides the data currently displayed in the asset editor. */
    public data = new AssetEditorData(this.weightUnits);

    /** @internal */
    public isGlobalValidation = false;

    /**
     * Validates the value currently displayed.
     * @param ref The ref of the control containing the value to validate.
     */
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

        if (!this.info.quantity.isRequired && this.isGlobalValidation &&
            ((ref === "address") || (ref === "quantity")) &&
            ((this.data.address === "") === (this.data.quantity === ""))) {
            return "Please fill out either the Address or the Quantity.";
        }

        // TODO: no-unnecessary-type-assertion is probably a false positive, see
        // https://github.com/palantir/tslint/issues/3540
        // tslint:disable-next-line:no-unsafe-any no-unnecessary-type-assertion
        return (control.$refs.input as HTMLInputElement).validationMessage || true;
    }

    /** Resets all controls to their initial state. */
    public reset() {
        // TODO: Check whether the reset() call is even necessary.
        // tslint:disable-next-line:no-unsafe-any
        (this.getControl("form") as any).reset();
        this.data = new AssetEditorData(this.weightUnits);
        this.info = new NoAssetInfo();
    }

    /**
     * Validates the values in all controls. If validation succeeds, the edited asset is saved and the editor is
     * closed. Otherwise the editor remains open.
     */
    public save() {
        this.isGlobalValidation = true;

        try {
            // tslint:disable-next-line:no-unsafe-any
            if ((this.getControl("form") as any).validate()) {
                const newAsset = this.info.createAsset(this.model, new AssetProperties(this.data));

                if (this.editedAsset) {
                    this.model.replaceAsset(this.editedAsset, newAsset);
                } else {
                    this.model.addAsset(new AssetBundle(newAsset));
                }

                this.cancel();
            }
        } finally {
            this.isGlobalValidation = false;
        }
    }

    /** Closes the asset editor without saving the edited values. */
    public cancel() {
        this.reset();
        // tslint:disable-next-line:no-null-keyword
        this.editedAsset = null;
        this.isOpen = false;
    }

    /** @internal */
    public edit(asset: Asset) {
        this.editedAsset = asset;
        this.info = this.infos.find((info) => info.type === asset.type) as IAssetInfo;
        this.data = new AssetEditorData(this.weightUnits, asset.interface);
        this.isOpen = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static * getWeightUnits() {
        for (const weightUnitProperty in WeightUnit) {
            if (Number.parseFloat(weightUnitProperty)) {
                const weightUnit = Number.parseFloat(weightUnitProperty) as WeightUnit;
                yield new WeightInfo(WeightUnitConverter.toString(weightUnit), weightUnit);
            }
        }
    }

    private static isFilledSelect(control: Vue, ref: string) {
        const value = (control as any).value;

        switch (ref) {
            case "type":
                // tslint:disable-next-line:no-unsafe-any
                return !!(value as IAssetInfo).type;
            case "weightUnit":
                // tslint:disable-next-line:no-unsafe-any
                return !!(value as WeightInfo).abbreviation;
            default:
                return false;
        }
    }

    // tslint:disable-next-line:no-null-keyword
    private editedAsset: Asset | null = null;
}
