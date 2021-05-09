// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { IAssetBundle } from "./Asset";
import { ExchangeRate } from "./ExchangeRate";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { IParent } from "./IEditable";
import { SingleAsset } from "./SingleAsset";
import { misc } from "./validation/schemas/AssetTypeName.schema";
import { CurrencyName } from "./validation/schemas/CurrencyName.schema";
import { IMiscAsset } from "./validation/schemas/IMiscAsset.schema";
import { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties.schema";
import { Quantity0 } from "./validation/schemas/Quantity0.schema";

/** Represents a miscellaneous asset. */
export class MiscAsset extends SingleAsset {
    public static readonly type = misc;

    public readonly type = misc;

    public readonly location: string;

    public readonly description: string;

    public get unit() {
        return MiscAsset.getUnit(this.value, this.valueCurrency);
    }

    // eslint-disable-next-line class-methods-use-this
    public get fineness() {
        return undefined;
    }

    public readonly value: number;

    public readonly valueCurrency: CurrencyName;

    public readonly quantity: Quantity0;

    public readonly displayDecimals = 0;

    public readonly notes: string;

    public constructor(parent: IParent, props: IMiscAssetProperties) {
        super(parent);
        this.location = props.location ?? "";
        this.description = props.description;
        this.value = props.value;
        this.valueCurrency = props.valueCurrency;
        this.quantity = props.quantity;
        this.notes = props.notes ?? "";
    }

    /** @internal */
    public toJSON(): IMiscAsset {
        return {
            type: this.type,
            location: this.location || undefined,
            description: this.description,
            value: this.value,
            valueCurrency: this.valueCurrency,
            quantity: this.quantity,
            notes: this.notes || undefined,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public bundle(bundle?: unknown): IAssetBundle {
        return new MiscAsset.Bundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected async queryUnitValueUsd() {
        return this.value / await ExchangeRate.get(this.valueCurrency);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly Bundle = class extends GenericAssetBundle<MiscAsset> implements IAssetBundle {
        public toJSON() {
            return {
                primaryAsset: this.assets[0].toJSON(),
            };
        }
    };

    private static readonly unitFormatOptions = {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        useGrouping: true,
    };

    private static getUnit(value: number, valueCurrency: CurrencyName) {
        return `${value.toLocaleString(undefined, MiscAsset.unitFormatOptions)} ${valueCurrency}`;
    }
}

export interface IMiscAssetCtor {
    readonly type: typeof MiscAsset.type;
    new (parent: IParent, props: IMiscAssetProperties): MiscAsset;
}
