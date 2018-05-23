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
import { WeightUnits } from "../model/WeightUnit";
import { AssetEditorData } from "./AssetEditorData";
import { AssetProperties } from "./AssetProperties";
import { ComponentBase } from "./ComponentBase";
import { CryptoWalletInfo } from "./CryptoWalletInfo";
import { IAssetInfo } from "./IAssetInfo";
import { NoAssetInfo } from "./NoAssetInfo";
import { PreciousMetalAssetInfo } from "./PreciousMetalAssetInfo";
import Select from "./Select.vue";
import TextField from "./TextField.vue";
import { TextFieldInfo } from "./TextFieldInfo";

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { Select, TextField } })
/** Implements the dialog used to edit assets. */
// tslint:disable-next-line:no-default-export
export default class AssetEditor extends ComponentBase<Model> {
    /** Provides a value indicating whether the asset editor is currently open. */
    public isOpen = false;

    /** Provides the title of the asset editor. */
    public get title() {
        return this.editedAsset ? "Edit Asset" : "New Asset";
    }

    /** Provides the list containing information about all the possible asset types. */
    public readonly assetInfos: IAssetInfo[] = [
        new CryptoWalletInfo("Bitcoin Wallet", 8, BtcWallet),
        new PreciousMetalAssetInfo("Silver", SilverAsset),
    ];

    /** Provides information about the currently selected asset type. */
    public assetInfo: IAssetInfo = new NoAssetInfo();

    /** Provides the list of the possible weight units. */
    public readonly weightUnits = Array.from(WeightUnits.getAllStrings());

    /** Provides the data currently displayed in the asset editor. */
    public data = new AssetEditorData();

    /** @internal */
    public isGlobalValidation = false;

    /**
     * Validates the value currently displayed.
     * @param ref The ref of the control containing the value to validate.
     */
    public validateSelect(ref: string) {
        const control = this.getControl(ref);

        if (!control) {
            return true;
        }

        const value = (control as any).value;

        // TODO: This is a workaround for #4, remove as soon as the associated bug has been fixed in vuetify.
        if (ref === "type" ? !(value as IAssetInfo).type : !value) {
            return "Please fill out this field.";
        }

        return AssetEditor.getNativeValidationMessage(control);
    }

    public validateTextField(propertyInfo: TextFieldInfo, control: Vue) {
        if (!this.assetInfo.quantity.isRequired && this.isGlobalValidation &&
            ((propertyInfo === this.assetInfo.address) || (propertyInfo === this.assetInfo.quantity)) &&
            ((!this.data.address) === (!this.data.quantity))) {
            return "Please fill out either the Address or the Quantity.";
        }

        return AssetEditor.getNativeValidationMessage(control);
    }

    /** Resets all controls to their initial state. */
    public reset() {
        // TODO: Check whether the reset() call is even necessary.
        // tslint:disable-next-line:no-unsafe-any
        (this.getControl("form") as any).reset();
        this.data = new AssetEditorData();
        this.assetInfo = new NoAssetInfo();
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
                const newAsset = this.assetInfo.createAsset(this.model, new AssetProperties(this.data));

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
        this.assetInfo = this.assetInfos.find((info) => info.type === asset.type) as IAssetInfo;
        this.data = new AssetEditorData(asset.interface);
        this.isOpen = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getNativeValidationMessage(control: Vue) {
        // TODO: no-unnecessary-type-assertion is probably a false positive, see
        // https://github.com/palantir/tslint/issues/3540
        // tslint:disable-next-line:no-unsafe-any no-unnecessary-type-assertion
        return (control.$refs.input as HTMLInputElement).validationMessage || true;
    }

    // tslint:disable-next-line:no-null-keyword
    private editedAsset: Asset | null = null;
}
