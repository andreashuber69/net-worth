// https://github.com/andreashuber69/net-worth#--
import { Application } from "./Application";
import type { IAssetBundle } from "./Asset";
import { AssetCollection } from "./AssetCollection";
import { ExchangeRate } from "./ExchangeRate";
import type { IParent } from "./IEditable";
import { QueryUtility } from "./QueryUtility";
import type { CurrencyName } from "./validation/schemas/CurrencyName.schema";
import { currencyNames } from "./validation/schemas/CurrencyName.schema";
import type { GroupBy } from "./validation/schemas/GroupBy.schema";
import type { ISort } from "./validation/schemas/ISort.schema";
import type { TaggedModel } from "./validation/schemas/TaggedModel.schema";

export interface IModelParameters {
    readonly name?: string;
    readonly wasSavedToFile?: boolean;
    readonly hasUnsavedChanges?: boolean;
    readonly currency?: CurrencyName;
    readonly groupBy?: GroupBy;
    readonly sort?: ISort;
    readonly createBundles: ReadonlyArray<(parent: IParent) => IAssetBundle>;
}

export type IModel = Required<TaggedModel>;

/** Represents the main model of the application. */
export class Model implements IParent {
    /** Provides the name of the asset collection. */
    public name: string;

    /** Provides the file extension. */
    public readonly fileExtension = ".assets";

    public get fileName() {
        return `${this.name}${this.fileExtension}`;
    }

    public wasSavedToFile: boolean;

    public get hasUnsavedChanges() {
        return this.hasUnsavedChangesImpl;
    }

    public set hasUnsavedChanges(value: boolean) {
        if (value !== this.hasUnsavedChangesImpl) {
            this.hasUnsavedChangesImpl = value;

            if (this.onChanged) {
                this.onChanged();
            }
        }
    }

    public get title() {
        return `${this.name}${this.hasUnsavedChanges ? " (Modified)" : ""} - ${Application.title}`;
    }

    /** Provides the available currencies to value the assets in. */
    // eslint-disable-next-line class-methods-use-this
    public get currencies() {
        return currencyNames;
    }

    /** Provides the selected currency. */
    public get currency() {
        return this.currencyImpl;
    }

    /** Provides the selected currency. */
    public set currency(currency: CurrencyName) {
        if (this.currencyImpl !== currency) {
            this.currencyImpl = currency;
            this.onCurrencyChanged();
        }
    }

    public readonly assets: AssetCollection;

    // cSpell: ignore usdxxx
    /**
     * Provides the USD exchange rate of the currently selected currency (USDXXX, where XXX is the currently selected
     * currency).
     */
    public exchangeRate: number | undefined = 1;

    /** Provides the method that is called when the model has changed. */
    public onChanged?: (() => void);

    public constructor(params?: IModelParameters) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        this.name = params?.name || "Unnamed";
        this.wasSavedToFile = params?.wasSavedToFile ?? false;
        this.hasUnsavedChangesImpl = params?.hasUnsavedChanges ?? false;
        this.currency = params?.currency ?? this.currencyImpl;
        this.assets = new AssetCollection({
            parent: this,
            bundles: params?.createBundles.map((c) => c(this)) ?? [],
            groupBy: params?.groupBy,
            sort: params?.sort,
        });
    }

    /** Returns a JSON-formatted string representing the model. */
    public toJsonString() {
        return JSON.stringify(this, undefined, 2);
    }

    /** @internal */
    public notifyChanged() {
        this.hasUnsavedChangesImpl = true;

        if (this.onChanged) {
            this.onChanged();
        }
    }

    /** @internal */
    public toJSON(): IModel {
        return {
            version: 1,
            name: this.name,
            wasSavedToFile: this.wasSavedToFile,
            hasUnsavedChanges: this.hasUnsavedChanges,
            currency: this.currency,
            groupBy: this.assets.ordering.groupBys[0],
            sort: this.assets.ordering.sort,
            bundles: this.assets.toJSON(),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private hasUnsavedChangesImpl: boolean;

    private currencyImpl: CurrencyName = this.currencies[0];

    private onCurrencyChanged() {
        // eslint-disable-next-line no-console
        this.onCurrencyChangedImpl().catch((reason) => void console.error(reason));
    }

    private async onCurrencyChangedImpl() {
        this.exchangeRate = undefined;
        // Status is intentionally ignored
        ({ result: this.exchangeRate } = await QueryUtility.execute(async () => ExchangeRate.get(this.currency)));
    }
}
