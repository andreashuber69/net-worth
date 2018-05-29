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
import { AssetEditorData } from "./AssetEditorData";
import { AssetProperties } from "./AssetProperties";
import { ComponentBase } from "./ComponentBase";
import { CryptoWalletInputInfo } from "./CryptoWalletInputInfo";
import { IAssetInputInfo } from "./IAssetInputInfo";
import { NoAssetEditInfo } from "./NoAssetEditInfo";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import Select from "./Select.vue";
import { SelectInputInfo } from "./SelectInputInfo";
import TextField from "./TextField.vue";
import { TextInputInfo } from "./TextInputInfo";

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

    /** Provides the asset type input information. */
    public get typeInputInfo() {
        return new SelectInputInfo("Type", "", true, true, this.assetInfos.map((info) => info.type));
    }

    /** Provides the currently selected asset type. */
    public get type() {
        return this.assetInfo.type;
    }

    public set type(value: string) {
        this.assetInfo = this.assetInfos.find((info) => info.type === value) as IAssetInputInfo;
    }

    /** Provides information about the currently selected asset type. */
    public assetInfo: IAssetInputInfo = new NoAssetEditInfo();

    /** Provides the data currently displayed in the asset editor. */
    public data = new AssetEditorData();

    /** @internal */
    public isGlobalValidation = false;

    /** Validates select input. */
    // tslint:disable-next-line:prefer-function-over-method
    public validateSelect(inputInfo: SelectInputInfo, control: Vue) {
        // TODO: This is a workaround for #4, remove as soon as the associated bug has been fixed in vuetify.
        if (!(control as any).value) {
            return "Please fill out this field.";
        }

        return AssetEditor.getNativeValidationMessage(control);
    }

    /** Validates text field input. */
    public validateTextField(inputInfo: TextInputInfo, control: Vue) {
        if (!this.assetInfo.quantity.isRequired && this.isGlobalValidation &&
            ((inputInfo === this.assetInfo.address) || (inputInfo === this.assetInfo.quantity)) &&
            ((!this.data.address) === (!this.data.quantity))) {
            return "Please fill out either the Address or the Quantity.";
        }

        return AssetEditor.getNativeValidationMessage(control);
    }

    public onResetClicked(event: MouseEvent) {
        this.reset();
    }

    public onSaveClicked(event: MouseEvent) {
        if (this.isValid()) {
            this.save();
            this.close();
        }
    }

    public onCancelClicked(event: MouseEvent) {
        this.close();
    }

    /** @internal */
    public edit(asset: Asset) {
        this.editedAsset = asset;
        this.assetInfo = this.assetInfos.find((info) => info.type === asset.type) as IAssetInputInfo;
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

    private readonly assetInfos: IAssetInputInfo[] = [
        new CryptoWalletInputInfo(BtcWallet.type, 8, BtcWallet),
        new PreciousMetalAssetInputInfo(SilverAsset.type, SilverAsset),
    ];

    // tslint:disable-next-line:no-null-keyword
    private editedAsset: Asset | null = null;

    private reset() {
        // TODO: Check whether the reset() call is even necessary.
        // tslint:disable-next-line:no-unsafe-any
        (this.getControl("form") as any).reset();
        this.data = new AssetEditorData();
        this.assetInfo = new NoAssetEditInfo();
    }

    private isValid() {
        this.isGlobalValidation = true;

        try {
            // tslint:disable-next-line:no-unsafe-any
            return (this.getControl("form") as any).validate();
        } finally {
            this.isGlobalValidation = false;
        }
    }

    private save() {
        const newAsset = this.assetInfo.createAsset(this.checkedValue, new AssetProperties(this.data));

        if (this.editedAsset) {
            this.checkedValue.replaceAsset(this.editedAsset, newAsset);
        } else {
            this.checkedValue.addAsset(new AssetBundle(newAsset));
        }
    }

    private close() {
        this.reset();
        // tslint:disable-next-line:no-null-keyword
        this.editedAsset = null;
        this.isOpen = false;
    }
}
