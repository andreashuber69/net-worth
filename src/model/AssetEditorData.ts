// https://github.com/andreashuber69/net-worth#--
import type { IAuxProperties } from "./IAuxProperties";
import { ObjectConverter } from "./ObjectConverter";
import type { AssetTypeName } from "./validation/schemas/AssetTypeName.schema";
import type { AssetUnion } from "./validation/schemas/AssetUnion.schema";
import type { CurrencyName } from "./validation/schemas/CurrencyName.schema";
import type { IMiscAsset} from "./validation/schemas/IMiscAsset.schema";
import { miscAssetTypeNames } from "./validation/schemas/IMiscAsset.schema";
import type { IPreciousMetalAsset} from "./validation/schemas/IPreciousMetalAsset.schema";
import { preciousMetalAssetTypeNames } from "./validation/schemas/IPreciousMetalAsset.schema";
import type { WeightUnitName } from "./validation/schemas/WeightUnit.schema";
import { WeightUnit } from "./validation/schemas/WeightUnit.schema";

/** Represents the data being edited in the asset editor. */
export class AssetEditorData implements Partial<IAuxProperties<string>> {
    public type: AssetTypeName | "";
    public location?: string;
    public description?: string;
    public address?: string;
    public weight?: string;
    public weightUnit?: WeightUnitName;
    public fineness?: string;
    public value?: string;
    public valueCurrency?: CurrencyName;
    public quantity?: string;
    public notes?: string;

    /** @internal */
    // The high ABC is due to the number of properties that need to be assigned. Breaking this up would not improve
    // readability.
    // codebeat:disable[ABC]
    public constructor(asset?: AssetUnion) {
        this.type = AssetEditorData.getType(asset);
        this.location = AssetEditorData.getLocation(asset);
        this.description = AssetEditorData.getDescription(asset);
        this.address = AssetEditorData.getAddress(asset);
        this.weight = AssetEditorData.getWeight(asset);
        this.weightUnit = AssetEditorData.getWeightUnit(asset);
        this.fineness = AssetEditorData.getFineness(asset);
        this.value = AssetEditorData.getValue(asset);
        this.valueCurrency = AssetEditorData.getValueCurrency(asset);
        this.quantity = AssetEditorData.getQuantity(asset);
        this.notes = AssetEditorData.getNotes(asset);
    }
    // codebeat:enable[ABC]

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getType(asset?: AssetUnion) {
        return asset?.type ?? "";
    }

    private static getLocation(asset?: AssetUnion) {
        return asset?.location;
    }

    private static getDescription(asset?: AssetUnion) {
        return asset?.description;
    }

    private static getAddress(asset?: AssetUnion) {
        return (asset && ("address" in asset) && asset.address) || undefined;
    }

    private static getWeight(asset?: AssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? asset.weight.toString() : undefined;
    }

    private static getWeightUnit(asset?: AssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? WeightUnit[asset.weightUnit] as WeightUnitName : undefined;
    }

    private static getFineness(asset?: AssetUnion) {
        return AssetEditorData.isPreciousMetalAsset(asset) ? asset.fineness.toString() : undefined;
    }

    private static getValue(asset?: AssetUnion) {
        return AssetEditorData.isMiscAsset(asset) ? asset.value.toString() : undefined;
    }

    private static getValueCurrency(asset?: AssetUnion) {
        return AssetEditorData.isMiscAsset(asset) ? asset.valueCurrency : undefined;
    }

    private static getQuantity(asset?: AssetUnion) {
        return (asset && ("quantity" in asset) && asset.quantity.toString()) || undefined;
    }

    private static getNotes(asset?: AssetUnion) {
        return asset?.notes;
    }

    private static isPreciousMetalAsset(asset?: AssetUnion): asset is IPreciousMetalAsset {
        return AssetEditorData.isType<IPreciousMetalAsset>(preciousMetalAssetTypeNames, asset);
    }

    private static isMiscAsset(asset?: AssetUnion): asset is IMiscAsset {
        return AssetEditorData.isType<IMiscAsset>(miscAssetTypeNames, asset);
    }

    private static isType<T extends AssetUnion>(
        types: ReadonlyArray<T["type"]>,
        rawAsset?: AssetUnion,
    ): rawAsset is T {
        return (rawAsset && ObjectConverter.is<T>(rawAsset, types)) || false;
    }
}
