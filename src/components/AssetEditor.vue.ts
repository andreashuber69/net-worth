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
import { AssetInputInfo } from "../model/AssetInputInfo";
import { BtcWallet } from "../model/BtcWallet";
import { CryptoWalletInputInfo } from "../model/CryptoWalletInputInfo";
import { Model } from "../model/Model";
import { PreciousMetalAssetInputInfo } from "../model/PreciousMetalAssetInputInfo";
import { SelectInputInfo } from "../model/SelectInputInfo";
import { SilverAsset } from "../model/SilverAsset";
import { SinglePropertyEntity } from "../model/SinglePropertyEntity";
import { TextInputInfo } from "../model/TextInputInfo";
import { AssetEditorData } from "./AssetEditorData";
import { AssetProperties } from "./AssetProperties";
import { ComponentBase } from "./ComponentBase";
import { NoAssetInputInfo } from "./NoAssetInputInfo";
import Select from "./Select.vue";
import TextField from "./TextField.vue";

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
    public readonly type = new SinglePropertyEntity(() => this.getType(), (value) => this.setType(value));

    /** Provides information about the currently selected asset type. */
    public assetInfo: AssetInputInfo = new NoAssetInputInfo();

    /** Provides the data currently displayed in the asset editor. */
    public data = new AssetEditorData();

    /** @internal */
    public isGlobalValidation = false;

    /** Validates text field input. */
    // tslint:disable-next-line:prefer-function-over-method
    public validateTextField(info: TextInputInfo) {
        return true;
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
        this.assetInfo = this.assetInfos.find((info) => info.type === asset.type) as AssetInputInfo;
        this.data = new AssetEditorData(asset.interface);
        this.isOpen = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly assetInfos: AssetInputInfo[] = [
        new CryptoWalletInputInfo(BtcWallet.type, 8, BtcWallet),
        new PreciousMetalAssetInputInfo(SilverAsset.type, SilverAsset),
    ];

    // tslint:disable-next-line:no-null-keyword
    private editedAsset: Asset | null = null;

    private getType() {
        return this.assetInfo.type;
    }

    private setType(value: string) {
        // TODO: It appears that it is not possible to inline these methods and pass them as lambdas to the Property
        // constructor. Compiler bug?
        this.assetInfo = this.assetInfos.find((info) => info.type === value) as AssetInputInfo;
    }

    private reset() {
        // TODO: Check whether the reset() call is even necessary.
        // tslint:disable-next-line:no-unsafe-any
        (this.getControl("form") as any).reset();
        this.data = new AssetEditorData();
        this.assetInfo = new NoAssetInputInfo();
    }

    private isValid() {
        this.assetInfo.includeRelations = true;

        try {
            // tslint:disable-next-line:no-unsafe-any
            return (this.getControl("form") as any).validate();
        } finally {
            this.assetInfo.includeRelations = false;
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
