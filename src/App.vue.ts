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
import BrowserDialog from "./components/BrowserDialog.vue";
import DataProvidersDialog from "./components/DataProvidersDialog.vue";
import SaveAsDialog from "./components/SaveAsDialog.vue";
import { Model } from "./model/Model";

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { AssetList, BrowserDialog, DataProvidersDialog, SaveAsDialog } })
// tslint:disable-next-line:no-default-export no-unsafe-any
export default class App extends Vue {
    public static get sessionStorageKeys() {
        return  [ this.sessionLocalStorageKey, this.sessionForceLoadFromLocalStorageKey ];
    }

    public isDrawerVisible = false;
    public model: Model;

    public constructor() {
        super();
        this.model = this.initModel(App.loadFromLocalStorage());
        window.addEventListener("beforeunload", (ev) => this.onBeforeUnload(ev));
    }

    public onMenuClicked(event: MouseEvent) {
        this.isDrawerVisible = !this.isDrawerVisible;
    }

    // tslint:disable-next-line:prefer-function-over-method
    public onNewClicked(event: MouseEvent) {
        this.isDrawerVisible = false;
        App.openNewWindow(App.emptyModelLocalStorageKey, false);
    }

    public onOpenClicked(event: MouseEvent) {
        this.isDrawerVisible = false;
        this.fileInput.click();
    }

    public async onFileInputChanged(event: Event) {
        const files = (event.target as any).files as FileList;

        if (files.length === 1) {
            const file = files[0];
            const model = App.parse(await App.read(file));

            if (model) {
                const name = file.name.endsWith(model.fileExtension) ?
                    file.name.substring(0, file.name.length - model.fileExtension.length) : file.name;

                if (name.length > 0) {
                    model.name = name;
                }

                if (this.model.hasUnsavedChanges) {
                    App.openNewWindow(App.saveToLocalStorage(model), true);
                } else {
                    this.model = this.initModel(model);
                }
            }
        }

        this.fileInput.value = "";
    }

    public async onSaveClicked(event: MouseEvent) {
        if (this.model.wasSavedToFile) {
            this.isDrawerVisible = false;
            this.write();
        } else {
            await this.onSaveAsClicked(event);
        }
    }

    public async onSaveAsClicked(event: MouseEvent) {
        this.isDrawerVisible = false;
        const newName = await this.saveAsDialog.showDialog(this.model.name);

        if (newName !== undefined) {
            this.model.name = newName;
            this.model.wasSavedToFile = true;
            this.write();
        }
    }

    public get assetList() {
        // tslint:disable-next-line:no-unsafe-any
        return this.$refs.assetList as AssetList;
    }

    public get saveAsDialog() {
        // tslint:disable-next-line:no-unsafe-any
        return this.$refs.saveAsDialog as SaveAsDialog;
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

    private static readonly emptyModelLocalStorageKey = "0";
    private static readonly sessionLocalStorageKey = "localStorageKey";
    private static readonly sessionForceLoadFromLocalStorageKey = "forceLoadFromLocalStorage";

    private static loadFromLocalStorage() {
        const localStorageKey = window.sessionStorage.getItem(this.sessionLocalStorageKey);

        if (localStorageKey) {
            // Existing session
            if ((localStorageKey !== this.emptyModelLocalStorageKey) &&
                // tslint:disable-next-line:deprecation
                ((window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) ||
                (window.sessionStorage.getItem(this.sessionForceLoadFromLocalStorageKey) === true.toString()))) {
                // Session storage can only be non-empty because the user either reloaded the page or because Open...
                // or New was clicked. Both call openNewWindow, which opens a new window with parameters attached to the
                // URL. Code in main.ts transfers any URL parameters into session storage and then uses
                // window.location.replace to reload without the parameters.
                return this.loadModel(localStorageKey);
            }
        } else {
            // New session
            // Put all old keys into the following array.
            const oldKeys = new Array<number>();

            for (let index = 0; index < window.localStorage.length; ++index) {
                const oldKey = window.localStorage.key(index);

                if (oldKey) {
                    const oldKeyNumber = Number.parseInt(oldKey);

                    if (oldKeyNumber) {
                        oldKeys.push(oldKeyNumber);
                    }
                }
            }

            // Sort the array in descending direction, so that the modified model that was last saved will be loaded.
            oldKeys.sort((l, r) => l < r ? 1 : -1);

            for (const oldKey of oldKeys) {
                const model = this.loadModel(oldKey.toString());

                if (model.hasUnsavedChanges) {
                    // The main goal of this whole mechanism is to prevent data loss, which is why, in a new session, we
                    // only ever load models that have unsaved changes. Models that have been written into a file but
                    // were nevertheless later saved to local storage as part of the browser being closed do not need to
                    // be considered here.
                    return model;
                }
            }
        }

        return new Model();
    }

    private static openNewWindow(localStorageKey: string, forceLoadFromLocalStorage: boolean) {
        const urlFirstPart = `${window.location.href}?${this.sessionLocalStorageKey}=${localStorageKey}`;
        const url = `${urlFirstPart}&${this.sessionForceLoadFromLocalStorageKey}=${forceLoadFromLocalStorage}`;
        window.open(url);
    }

    private static read(blob: Blob) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(reader.result as string);
            reader.onerror = (ev) => reject("Unable to read file.");
            reader.readAsText(blob);
        });
    }

    private static parse(json: string | null) {
        const model = json ? Model.parse(json) : undefined;

        if (model instanceof Model) {
            return model;
        } else if (model) {
            alert(model);
        }

        return undefined;
    }

    private static saveToLocalStorage(model: Model) {
        let key: string | undefined = this.emptyModelLocalStorageKey;

        if (model.groups.length > 0) {
            const json = model.toJsonString();

            // tslint:disable-next-line:no-empty
            while (!(key = this.trySaveToLocalStorage(json))) {
            }
        }

        return key;
    }

    private static loadModel(localStorageKey: string) {
        const result = this.parse(window.localStorage.getItem(localStorageKey));

        if (result) {
            while (window.sessionStorage.length > 0) {
                window.sessionStorage.removeItem(window.sessionStorage.key(0) || "");
            }

            window.localStorage.removeItem(localStorageKey);

            return result;
        }

        return new Model();
    }

    private static trySaveToLocalStorage(json: string) {
        // We need a key that is unique and monotonously increasing. When a browser is closed with the application
        // running in multiple tabs, it is likely that two tabs will get the same value from Date.now(). The random
        // component should reduce the likelihood of a collision.
        const uniqueNumber = Math.trunc((Date.now() + Math.random()) * Math.pow(2, 10));

        if (!Number.isSafeInteger(uniqueNumber)) {
            // Make sure all digits are significant. Since Date.now() currently returns a value with 41 binary digits,
            // adding another 10 binary digits should keep us well below the 53 binary digits commonly supported for
            // safe integers.
            throw new Error("Can't create unique key.");
        }

        const uniqueKey = uniqueNumber.toString();

        if (window.localStorage.getItem(uniqueKey)) {
            return undefined;
        }

        window.localStorage.setItem(uniqueKey, json);

        // There's still a low probability that two browser tabs arrive at the same key at the same time and an
        // overwrite happens. Verifying the written should reduce this further.
        return window.localStorage.getItem(uniqueKey) === json ? uniqueKey : undefined;
    }

    private get fileInput() {
        // tslint:disable-next-line:no-unsafe-any
        return this.$refs.fileInput as HTMLInputElement;
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

    private initModel(model: Model) {
        model.onChanged = () => this.onModelChanged();
        document.title = model.title;

        return model;
    }

    private onBeforeUnload(ev: BeforeUnloadEvent) {
        // Apparently, there's no reliable way to prevent the user from closing a browser window that contains unsaved
        // changes. Both Chromium and Firefox currently refuse to show a confirmation dialog that is opened in a
        // "beforeunload" handler and the documentation for the event warns that this could be the case. Therefore, the
        // only way to prevent the loss of unsaved data is to save our data either continuously or in the "beforeunload"
        // handler. We could either save through window.localStorage or download to the users hard drive (via the same
        // mechanism as when the user invokes the "Save..." menu entry). However, the latter is bound to surprise at
        // least some users and doesn't seem to work on some browsers anyway (e.g. Firefox). Our only remaining option
        // is to therefore save to local storage.
        // Obviously, just saving to local storage under one key (e.g. "assets") only works reliably if the user
        // confines herself to not ever work with Net Worth in more than one browser window. Since we seem to have
        // no way of preventing or detecting use in multiple browser windows, the storage mechanism must ideally satisfy
        // the following requirements:
        // 1. No committed but as of yet unsaved change in any browser window is ever lost if the user closes a tab,
        //    closes the whole browser or reloads the page at any time.
        // 2. It must be trivial to regain access to unsaved changes.
        // It appears that both requirements can be satisfied with the following mechanism:
        // - Data is always saved to local storage in a "beforeunload" handler under a monotonously increasing key,
        //   which is then also stored through window.sessionStorage.
        // - When the Net Worth page loads, session storage is first checked for a saved key. If one exists, data
        //   under said key is then loaded from local storage. This ensures that the same data is always displayed
        //   before and after a page reload. If session storage does not contain a key, data under the largest key is
        //   loaded from local storage.
        // - Successfully loaded data is always *deleted* from local storage immediately. This ensures that navigating
        //   to Net Worth in additional browser windows will never load the same data in more than one browser
        //   window.
        // The above should ensure that Net Worth can be used much like a normal desktop application. Even if the
        // application is used in multiple tabs when the browser is closed, data in said tabs will be reloaded next
        // time the user navigates to the Net Worth in the same number of tabs/windows. This is nicely complemented
        // by the fact that many browsers have an option to automatically reload all previously open tabs when the
        // browser is started.
        // Unfortunately, the beforeunload handler doesn't seem to ever be called on Android when the user closes the
        // browser, neither on Chrome, Firefox nor Edge. Luckily, at least reload works.
        window.sessionStorage.setItem(App.sessionLocalStorageKey, App.saveToLocalStorage(this.model));
    }

    private onModelChanged() {
        document.title = this.model.title;
    }
}
