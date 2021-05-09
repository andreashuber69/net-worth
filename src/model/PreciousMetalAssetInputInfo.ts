// https://github.com/andreashuber69/net-worth#--
import { AssetInputInfo } from "./AssetInputInfo";
import type { IParent } from "./IEditable";
import type { PreciousMetalAsset } from "./PreciousMetalAsset";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import type { PreciousMetalAssetTypeName } from "./validation/schemas/IPreciousMetalAsset.schema";
import type { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";
import { weightUnitNames } from "./validation/schemas/WeightUnit.schema";

export interface IPreciousMetalAssetCtor {
    readonly type: PreciousMetalAssetTypeName;
    new (parent: IParent, props: IPreciousMetalAssetProperties): PreciousMetalAsset;
}

/**
 * Defines how the properties of a precious metal asset need to be input and validated and provides a method to create a
 * representation of the asset.
 */
export class PreciousMetalAssetInputInfo extends AssetInputInfo {
    public get type() {
        return this.ctor.type;
    }

    public readonly location = new TextInputInfo({
        label: "Location",
        hint: "The location, e.g. 'Safe', 'Safety Deposit Box'.",
        isPresent: true,
        isRequired: false,
        schemaName: "Text",
    });

    public readonly description = new TextInputInfo({
        label: "Description",
        hint: "Describes the items, e.g. 'Coins', 'Bars'.",
        isPresent: true,
        isRequired: true,
        schemaName: "Text",
    });

    public readonly address = new TextInputInfo();

    public readonly weight = new TextInputInfo({
        label: "Weight",
        hint: "The weight of a single item, expressed in Unit.",
        isPresent: true,
        isRequired: true,
        schemaName: "Weight",
    });

    public readonly weightUnit = new SelectInputInfo({
        label: "Unit",
        hint: "The unit Weight is expressed in.",
        isPresent: true,
        isRequired: true,
        items: weightUnitNames,
        enumSchemaNames: ["WeightUnitName"],
    });

    public readonly fineness = new TextInputInfo({
        label: "Fineness",
        hint: "The precious metal fineness.",
        isPresent: true,
        isRequired: true,
        schemaName: "Fineness",
    });

    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo();

    public readonly quantity = new TextInputInfo({
        label: "Quantity", hint: "The number of items.", isPresent: true, isRequired: true, schemaName: "Quantity0",
    });

    /** @internal */
    public constructor(private readonly ctor: IPreciousMetalAssetCtor) {
        super();
    }

    public createAsset(parent: IParent, props: IPreciousMetalAssetProperties) {
        return new this.ctor(parent, props);
    }
}
