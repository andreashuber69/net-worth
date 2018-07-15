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
import { Model } from "./model/Model";

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { AssetList } })
// tslint:disable-next-line:no-default-export no-unsafe-any
export default class App extends Vue {
    public isDrawerVisible = false;
    public areDataProvidersVisible = false;
    public model: Model;

    public constructor() {
        super();
        this.model = App.parse(undefined, App.loadFromLocalStorage()) || new Model();
        this.model.onChanged = () => this.onModelChanged();
    }

    public onMenuClicked(event: MouseEvent) {
        this.isDrawerVisible = !this.isDrawerVisible;
    }

    public onOpenClicked(event: MouseEvent) {
        this.isDrawerVisible = false;
        this.fileInput.click();
    }

    public async onFileInputChanged(event: Event) {
        const files = (event.target as any).files as FileList;

        if (files.length === 1) {
            const file = files[0];
            const model = App.parse(file.name, await App.read(file));

            if (model) {
                model.onChanged = () => this.onModelChanged();
                this.model = model;
            }
        }

        this.fileInput.value = "";
    }

    public onSaveClicked(event: MouseEvent) {
        this.isDrawerVisible = false;
        const blob = new Blob([ this.model.toJsonString() ], { type : "application/json" });
        App.write(`${this.model.name}.json`, blob);
    }

    public get assetList() {
        // tslint:disable-next-line:no-unsafe-any
        return this.$refs.assetList as AssetList;
    }

    public get groupBys() {
        return this.model.groupByLabels;
    }

    public get groupBy() {
        return this.model.groupByLabel;
    }

    public set groupBy(groupBy: string) {
        const rawGroupBy = this.model.groupBys.find((g) => g === groupBy.toLowerCase());

        if (rawGroupBy !== undefined) {
            this.model.groupBy = rawGroupBy;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly assetsKey = "assets";

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

    private static read(blob: Blob) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(reader.result as string);
            reader.onerror = (ev) => reject("Unable to read file.");
            reader.readAsText(blob);
        });
    }

    private static parse(fileName: string | undefined, json: string | null) {
        const model = json ? Model.parse(json) : undefined;

        if (model instanceof Model) {
            if (fileName) {
                const extension = ".json";
                const name = fileName.endsWith(extension) ?
                    fileName.substring(0, fileName.length - extension.length) : fileName;

                if (name.length > 0) {
                    model.name = name;
                }
            }

            this.saveToLocalStorage(model.toJsonString());

            return model;
        } else if (model) {
            alert(model);
        }

        return undefined;
    }

    private static saveToLocalStorage(json: string) {
        window.localStorage.setItem(this.assetsKey, json);
    }

    private static loadFromLocalStorage() {
        return window.localStorage.getItem(this.assetsKey);
    }

    private get fileInput() {
        // tslint:disable-next-line:no-unsafe-any
        return this.$refs.fileInput as HTMLInputElement;
    }

    private onModelChanged() {
        App.saveToLocalStorage(this.model.toJsonString());
    }
}
