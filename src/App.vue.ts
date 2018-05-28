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
import AssetList from "./components/AssetList.vue";
import { IModel } from "./model/Asset";
import { AssetBundle } from "./model/AssetBundle";
import { BtcWallet } from "./model/BtcWallet";
import { CryptoWallet, ICryptoWalletProperties } from "./model/CryptoWallet";
import { Model } from "./model/Model";
import { IPreciousMetalAssetProperties, PreciousMetalAsset } from "./model/PreciousMetalAsset";
import { SilverAsset } from "./model/SilverAsset";
import { WeightUnit } from "./model/WeightUnit";

interface IStringIndexable {
    [key: string]: any;
}

interface ICryptoWalletConstructor {
    new (parent: IModel, properties: ICryptoWalletProperties): CryptoWallet;
}

interface IPreciousMetalAssetConstructor {
    new (parent: IModel, properties: IPreciousMetalAssetProperties): PreciousMetalAsset;
}

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { AssetList } })
// tslint:disable-next-line:no-default-export no-unsafe-any
export default class App extends Vue {
    public isDrawerVisible = false;
    public model = new Model();

    public onMenuIconClicked(event: MouseEvent) {
        this.isDrawerVisible = !this.isDrawerVisible;
    }

    public onOpenClicked(event: MouseEvent) {
        this.isDrawerVisible = false;
        // tslint:disable-next-line:no-unsafe-any
        (this.$refs.fileInput as HTMLInputElement).click();
    }

    public onSaveClicked(event: MouseEvent) {
        this.isDrawerVisible = false;
        const blob = new Blob([ JSON.stringify(this.model, undefined, 2) ], { type : "application/json" });
        App.write("MyAssets.json", blob);
    }

    // tslint:disable-next-line:prefer-function-over-method
    public async onFileInputChanged(event: Event) {
        const files = (event.target as any).files as FileList;

        if (files.length === 1) {
            const rawModel = JSON.parse(await App.read(files[0]));
            const model = new Model();

            if (rawModel instanceof Array) {
                for (const rawBundle of rawModel) {
                    if (rawBundle instanceof Array) {
                        const bundle = new AssetBundle();

                        for (const rawAsset of rawBundle) {
                            const asset = App.createAsset(model, rawAsset);

                            if (asset) {
                                bundle.assets.push(asset);
                            }
                        }

                        if (bundle.assets.length > 0) {
                            model.addAsset(bundle);
                        }
                    }
                }
            }

            this.model = model;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static write(filename: string, blob: Blob) {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const elem = window.document.createElement("a");

            // We should call window.URL.revokeObjectURL as soon as the user has either successfully downloaded the
            // file or cancelled the download, but there seems to be no reliable way to detect these events. According
            // to the docs the objects will be garbage collected anyway when the user closes the tab or navigates away.
            // Given the currently small size of these downloads, not calling revokeObjectURL is probably good enough.
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    private static async read(blob: Blob) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(reader.result as string);
            reader.onerror = (ev) => reject("Unable to read file.");
            reader.readAsText(blob);
        });
    }

    private static createAsset(model: IModel, rawAsset: any) {
        if (App.hasStringIndexer(rawAsset)) {
            if (App.hasTypeMember(rawAsset)) {
                switch (rawAsset.type) {
                    case BtcWallet.type:
                        return this.createCryptoWallet(model, rawAsset, BtcWallet);
                    case SilverAsset.type:
                        return this.createPreciousMetalAsset(model, rawAsset, SilverAsset);
                    default:
                }
            }
        }

        return undefined;
    }

    private static hasStringIndexer(value: any): value is IStringIndexable {
        return value instanceof Object;
    }

    private static hasTypeMember(value: IStringIndexable): value is { type: string } {
        return typeof value.type === "string";
    }

    private static createCryptoWallet(
        model: IModel, raw: IStringIndexable, constructor: ICryptoWalletConstructor) {
        if (!this.hasCryptoWalletProperties(raw) || (!raw.address === !raw.quantity) ||
            (raw.quantity && (raw.quantity <= 0))) {
            return undefined;
        }

        return new constructor(model, raw);
    }

    private static createPreciousMetalAsset(
        model: IModel, raw: IStringIndexable, constructor: IPreciousMetalAssetConstructor) {
        if (!this.hasPreciousMetalAssetProperties(raw) || (raw.weight <= 0) || !WeightUnit[raw.weightUnit] ||
            (raw.fineness < 0.5) || (raw.fineness > 0.999999) || (!raw.quantity) || (raw.quantity <= 0) ||
            (raw.quantity % 1 !== 0)) {
            return undefined;
        }

        return new constructor(model, raw);
    }

    private static hasCryptoWalletProperties(value: IStringIndexable): value is ICryptoWalletProperties {
        const quantityType = typeof value.quantity;

        return (typeof value.description === "string") && (typeof value.location === "string") &&
            (typeof value.address === "string") && ((quantityType === "number") || (quantityType === "undefined"));
    }

    private static hasPreciousMetalAssetProperties(value: IStringIndexable): value is IPreciousMetalAssetProperties {
        return (typeof value.description === "string") && (typeof value.location === "string") &&
            (typeof value.weight === "number") && (typeof value.weightUnit === "number") &&
            (typeof value.fineness === "number") && (typeof value.quantity === "number");
    }
}
