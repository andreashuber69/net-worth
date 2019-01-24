// Copyright (C) 2018-2019 Andreas Huber Dönni
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
// tslint:disable-next-line:no-default-import
import AboutDialog from "./components/AboutDialog.vue";
// tslint:disable-next-line:no-default-import
import AssetList from "./components/AssetList.vue";
// tslint:disable-next-line:no-default-import
import BrowserDialog from "./components/BrowserDialog.vue";
// tslint:disable-next-line:no-default-import
import SaveAsDialog from "./components/SaveAsDialog.vue";
import { LocalStorage } from "./LocalStorage";
import { Model } from "./model/Model";
import { QueryCache } from "./model/QueryCache";
import { Parser } from "./Parser";

@Component({ components: { AboutDialog, AssetList, BrowserDialog, SaveAsDialog } })
// tslint:disable-next-line:no-default-export
export default class App extends Vue {
    public isDrawerVisible = false;
    public model: Model;

    public constructor() {
        super();
        this.model = App.initModel(LocalStorage.load());
        window.addEventListener("beforeunload", (ev) => this.onBeforeUnload(ev));
    }

    public onMenuClicked() {
        this.isDrawerVisible = !this.isDrawerVisible;
    }

    public onNewClicked() {
        this.isDrawerVisible = false;
        LocalStorage.openNewWindow(undefined);
    }

    public onOpenClicked() {
        this.isDrawerVisible = false;
        this.fileInput.click();
    }

    public async onFileInputChanged() {
        try {
            await this.onFileInputChangedImpl();
        } finally {
            this.fileInput.value = "";
        }
    }

    public async onSaveClicked() {
        if (this.model.wasSavedToFile) {
            this.isDrawerVisible = false;
            this.write();
        } else {
            await this.onSaveAsClicked();
        }
    }

    public async onSaveAsClicked() {
        this.isDrawerVisible = false;
        const newName = await (this.$refs.saveAsDialog as SaveAsDialog).showDialog(this.model.name);

        if (newName !== undefined) {
            this.model.name = newName;
            this.model.wasSavedToFile = true;
            this.write();
        }
    }

    public onAboutClicked() {
        this.isDrawerVisible = false;
        (this.$refs.aboutDialog as AboutDialog).showDialog();
    }

    public onRefreshClicked() {
        QueryCache.clear();
        this.model = App.initModel(Parser.parse(this.model.toJsonString()) || new Model());
    }

    public get groupBys() {
        return this.model.assets.ordering.groupByLabels;
    }

    public get groupBy() {
        return this.model.assets.ordering.groupByLabel;
    }

    public set groupBy(groupBy: string) {
        const rawGroupBy = this.model.assets.ordering.groupBys.find((g) => g === groupBy.toLowerCase());

        if (rawGroupBy !== undefined) {
            this.model.assets.ordering.groupBy = rawGroupBy;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static read(blob: Blob) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(reader.result as string);
            reader.onerror = (ev) => reject("Unable to read file.");
            reader.readAsText(blob);
        });
    }

    private static initModel(model: Model) {
        model.onChanged = () => document.title = model.title;
        document.title = model.title;

        return model;
    }

    private get fileInput() {
        return this.$refs.fileInput as HTMLInputElement;
    }

    private async onFileInputChangedImpl() {
        const files = this.fileInput.files;

        if (!files || (files.length !== 1)) {
            return;
        }

        const file = files[0];
        const model = Parser.parse(await App.read(file));

        if (!model) {
            return;
        }

        const name = file.name.endsWith(model.fileExtension) ?
            file.name.substring(0, file.name.length - model.fileExtension.length) : file.name;

        if (name.length > 0) {
            model.name = name;
        }

        if (this.model.hasUnsavedChanges) {
            LocalStorage.openNewWindow(model);
        } else {
            this.model = App.initModel(model);
        }
    }

    private write() {
        this.model.hasUnsavedChanges = false;
        const blob = new Blob([ this.model.toJsonString() ], { type : "application/json" });

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, this.model.fileName);
        } else {
            const elem = window.document.createElement("a");

            // We should call window.URL.revokeObjectURL as soon as the user has either successfully downloaded the
            // file or cancelled the download, but there seems to be no reliable way to detect these events. According
            // to the docs the objects will be garbage collected anyway when the user closes the tab or navigates away.
            // Given the currently small size of these downloads, not calling revokeObjectURL is probably good enough.
            elem.href = window.URL.createObjectURL(blob);
            elem.download = this.model.fileName;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    private onBeforeUnload(ev: BeforeUnloadEvent) {
        LocalStorage.save(this.model);
    }
}
