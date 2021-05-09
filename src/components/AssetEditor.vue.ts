// https://github.com/andreashuber69/net-worth#--
import { Component, Vue } from "vue-property-decorator";
import type { Asset } from "../model/Asset";
import { AssetEditorData } from "../model/AssetEditorData";
import { AssetInput } from "../model/AssetInput";
import type { AssetInputInfo } from "../model/AssetInputInfo";
import { createAsset } from "../model/AssetProperties";
import type { IParent } from "../model/IEditable";
import { SelectInputInfo } from "../model/SelectInputInfo";
import { assetTypeNames } from "../model/validation/schemas/AssetTypeName.schema";
import { NoAssetInputInfo } from "./NoAssetInputInfo";
import Select from "./Select.vue";
import TextArea from "./TextArea.vue";
import TextField from "./TextField.vue";

@Component({ components: { Select, TextArea, TextField } })
/** Implements the dialog used to edit assets. */
// eslint-disable-next-line import/no-default-export
export default class AssetEditor extends Vue {
    public isOpen = false;

    public get title() {
        return this.isExistingAsset ? "Edit Asset" : "New Asset";
    }

    /** Provides the asset type input information. */
    // eslint-disable-next-line class-methods-use-this
    public get typeInputInfo() {
        return new SelectInputInfo({
            label: "Type",
            hint: "",
            isPresent: true,
            isRequired: true,
            items: assetTypeNames,
            enumSchemaNames: ["AssetTypeName"],
        });
    }

    /** Provides the currently selected asset type. */
    public get type() {
        return this.assetInfo.type;
    }

    public set type(value: string | undefined) {
        this.assetInfo = (value && AssetInput.infos[value]) || new NoAssetInputInfo();
        this.data.type = this.assetInfo.type;
    }

    /** Provides information about the currently selected asset type. */
    public assetInfo: AssetInputInfo = new NoAssetInputInfo();

    /** Provides the data currently displayed in the asset editor. */
    public data = new AssetEditorData();

    public onSaveClicked() {
        if (!this.parent) {
            throw new Error("No parent set!");
        }

        if (this.isValid()) {
            this.close(createAsset(this.parent, this.data));
        }
    }

    public onCancelClicked() {
        this.close();
    }

    /** @internal */
    public async showDialog(parent: IParent, asset?: Asset) {
        this.parent = parent;
        this.isExistingAsset = Boolean(asset);
        this.assetInfo = AssetEditor.getAssetInfo(asset) ?? new NoAssetInputInfo();
        this.data = new AssetEditorData(asset ? asset.editableAsset.toJSON() : undefined);
        this.isOpen = true;

        return new Promise<Asset | undefined>((resolve) => (this.resolve = resolve));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getAssetInfo(asset: Asset | undefined) {
        return asset ? AssetInput.infos[asset.editableAsset.type] : undefined;
    }

    private parent?: IParent;
    private isExistingAsset = false;
    private resolve?: (value: Asset | undefined) => void;

    private isValid() {
        this.assetInfo.includeRelations = true;

        try {
            return this.form.validate();
        } finally {
            this.assetInfo.includeRelations = false;
        }
    }

    private close(asset?: Asset) {
        // This is necessary so that the Type field does not initially show an error next time we add a new asset.
        this.form.reset();
        // The following line ensures that the property is changed even if we happen to edit the same asset
        // again. Said change is necessary so that the vue.js change detection is triggered after clearing all fields
        // with the reset call above.
        this.assetInfo = new NoAssetInputInfo();
        this.isOpen = false;

        if (!this.resolve) {
            throw new Error("No resolve callback set!");
        }

        this.resolve(asset);
    }

    private get form() {
        // The runtime type of this.$refs.form is VueComponent. It appears nobody has written typings for this yet.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.$refs.form as any;
    }
}
