// https://github.com/andreashuber69/net-worth#--
import { Component, Vue } from "vue-property-decorator";

import type { BeforeInstallPromptEvent } from "./BeforeInstallPromptEvent";
import AboutDialog from "./components/AboutDialog.vue";
import AssetList from "./components/AssetList.vue";
import BrowserDialog from "./components/BrowserDialog.vue";
import SaveAsDialog from "./components/SaveAsDialog.vue";
import { LocalStorage } from "./LocalStorage";
import { Model } from "./model/Model";
import { QueryCache } from "./model/QueryCache";
import { Parser } from "./Parser";

@Component({ components: { AboutDialog, AssetList, BrowserDialog, SaveAsDialog } })
// eslint-disable-next-line import/no-default-export
export default class App extends Vue {
    public isDrawerVisible = false;
    public model: Model;

    public constructor() {
        super();
        this.model = App.initModel(LocalStorage.load());
        window.addEventListener("beforeunload", () => void LocalStorage.save(this.model));
        window.addEventListener("beforeinstallprompt", (ev) => void this.onBeforeInstallPrompt(ev));
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

    public get canInstall() {
        return Boolean(this.beforeInstallPrompt);
    }

    public async onInstallClicked(): Promise<void> {
        if (this.beforeInstallPrompt) {
            const ev = this.beforeInstallPrompt;
            this.beforeInstallPrompt = false;
            this.isDrawerVisible = false;
            await ev.prompt();
        }
    }

    public onAboutClicked() {
        this.isDrawerVisible = false;
        (this.$refs.aboutDialog as AboutDialog).showDialog();
    }

    public onRefreshClicked() {
        QueryCache.clear();
        this.model = App.initModel(Parser.parse(this.model.toJsonString()) ?? new Model());
    }

    public get groupBys() {
        return this.model.assets.ordering.defaultGroupByLabels;
    }

    public get groupBy() {
        return this.model.assets.ordering.groupByLabels[0];
    }

    public set groupBy(groupBy: string) {
        const rawGroupBy = this.model.assets.ordering.groupBys.find((g) => g === groupBy.toLowerCase());

        if (rawGroupBy !== undefined) {
            this.model.assets.ordering.setGroupBy(rawGroupBy);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static async read(blob: Blob) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => void resolve(reader.result as string);
            reader.onerror = () => void reject(new Error("Unable to read file."));
            reader.readAsText(blob);
        });
    }

    private static initModel(model: Model) {
        model.onChanged = () => (document.title = model.title);
        document.title = model.title;

        return model;
    }

    private beforeInstallPrompt: BeforeInstallPromptEvent | false = false;

    private get fileInput() {
        return this.$refs.fileInput as HTMLInputElement;
    }

    private onBeforeInstallPrompt(ev: BeforeInstallPromptEvent) {
        ev.preventDefault();
        this.beforeInstallPrompt = ev;
    }

    private async onFileInputChangedImpl() {
        const { files } = this.fileInput;

        if (!files || (files.length !== 1)) {
            return;
        }

        const [file] = files;
        const model = Parser.parse(await App.read(file));

        if (!model) {
            return;
        }

        const name = file.name.endsWith(model.fileExtension) ?
            file.name.substring(0, file.name.length - model.fileExtension.length) :
            file.name;

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
        const blob = new Blob([this.model.toJsonString()], { type: "application/json" });

        if (window.navigator.msSaveBlob) {
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
}
