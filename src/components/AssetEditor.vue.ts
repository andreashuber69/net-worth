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
import { AssetInput } from "../model/AssetInput";
import { AssetInputInfo } from "../model/AssetInputInfo";
import { Model } from "../model/Model";
import { SelectInputInfo } from "../model/SelectInputInfo";
import { AssetEditorData } from "./AssetEditorData";
import { AssetProperties } from "./AssetProperties";
import { ComponentBase } from "./ComponentBase";
import { NoAssetInputInfo } from "./NoAssetInputInfo";
import Select from "./Select.vue";
import TextArea from "./TextArea.vue";
import TextField from "./TextField.vue";

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { Select, TextArea, TextField } })
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
        return new SelectInputInfo("Type", "", true, true, AssetInput.infos.map((info) => info.type));
    }

    /** Provides the currently selected asset type. */
    public get type() {
        return this.assetInfo.type;
    }

    public set type(value: string) {
        this.assetInfo = AssetInput.infos.find((info) => info.type === value) as AssetInputInfo;
    }

    /** Provides information about the currently selected asset type. */
    public assetInfo: AssetInputInfo = new NoAssetInputInfo();

    /** Provides the data currently displayed in the asset editor. */
    public data = new AssetEditorData();

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
    public add() {
        this.isOpen = true;
    }

    /** @internal */
    public edit(asset: Asset) {
        const assetInfo = AssetInput.infos.find((info) => info.type === asset.type);

        if (assetInfo !== undefined) {
            this.editedAsset = asset;
            this.assetInfo = assetInfo;
            this.data = new AssetEditorData(asset.interface);
            this.isOpen = true;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:no-null-keyword
    private editedAsset: Asset | null = null;

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
            this.checkedValue.addAsset(newAsset);
        }
    }

    private close() {
        // TODO: Check whether the reset() call is even necessary.
        // tslint:disable-next-line:no-unsafe-any
        (this.getControl("form") as any).reset();
        this.data = new AssetEditorData();
        this.assetInfo = new NoAssetInputInfo();

        // tslint:disable-next-line:no-null-keyword
        this.editedAsset = null;
        this.isOpen = false;
    }
}
