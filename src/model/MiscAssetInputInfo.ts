// https://github.com/andreashuber69/net-worth#--
import { AssetInputInfo } from "./AssetInputInfo";
import type { IParent } from "./IEditable";
import { MiscAsset } from "./MiscAsset";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { currencyNames } from "./validation/schemas/CurrencyName.schema";
import type { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties.schema";

/**
 * Defines how the properties of a miscellaneous asset need to be input and validated and provides a method to create a
 * representation of the asset.
 */
export class MiscAssetInputInfo extends AssetInputInfo {
    // eslint-disable-next-line class-methods-use-this
    public get type(): typeof MiscAsset.type {
        return MiscAsset.type;
    }

    public readonly location = new TextInputInfo({
        label: "Location",
        hint: "The location, e.g. 'Safe', 'Redford'.",
        isPresent: true,
        isRequired: false,
        schemaName: "Text",
    });

    public readonly description = new TextInputInfo({
        label: "Description",
        hint: "The nature of the items, e.g. 'Cash', 'Vacation House'.",
        isPresent: true,
        isRequired: true,
        schemaName: "Text",
    });

    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo();
    public readonly fineness = new TextInputInfo();

    public readonly value = new TextInputInfo({
        label: "Value",
        hint: "The value of a single item, expressed in Currency. A liability can be expressed with a negative number",
        isPresent: true,
        isRequired: true,
        schemaName: "Value",
    });

    public readonly valueCurrency = new SelectInputInfo({
        label: "Currency",
        hint: "The currency Value is expressed in.",
        isPresent: true,
        isRequired: true,
        items: currencyNames,
        enumSchemaNames: ["CurrencyName"],
    });

    public readonly quantity = new TextInputInfo({
        label: "Quantity", hint: "The number of items.", isPresent: true, isRequired: true, schemaName: "Quantity0",
    });

    // eslint-disable-next-line class-methods-use-this
    public createAsset(parent: IParent, props: IMiscAssetProperties) {
        return new MiscAsset(parent, props);
    }
}
