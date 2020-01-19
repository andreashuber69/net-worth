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

import { Application } from "./Application";
import { IParent } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { AssetCollection } from "./AssetCollection";
import { ExchangeRate } from "./ExchangeRate";
import { QueryUtility } from "./QueryUtility";
import { CurrencyName, currencyNames } from "./validation/schemas/CurrencyName.schema";
import { GroupBy } from "./validation/schemas/GroupBy.schema";
import { ISort } from "./validation/schemas/ISort.schema";
import { TaggedModel } from "./validation/schemas/TaggedModel.schema";

export interface IModelParameters {
    readonly name?: string;
    readonly wasSavedToFile?: boolean;
    readonly hasUnsavedChanges?: boolean;
    readonly currency?: CurrencyName;
    readonly groupBy?: GroupBy;
    readonly sort?: ISort;
    readonly createBundles: ReadonlyArray<(parent: IParent) => AssetBundle>;
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

    /**
     * cSpell: ignore usdxxx
     * Provides the USD exchange rate of the currently selected currency (USDXXX, where XXX is the currently selected
     * currency).
     */
    public exchangeRate: number | undefined = 1;

    /** Provides the method that is called when the model has changed. */
    public onChanged?: (() => void);

    public constructor(params?: IModelParameters) {
        this.name = (params && params.name) || "Unnamed";
        this.wasSavedToFile = (params && params.wasSavedToFile) || false;
        this.hasUnsavedChangesImpl = (params && params.hasUnsavedChanges) || false;
        this.currency = (params && params.currency) || this.currencyImpl;
        this.assets = new AssetCollection({
            parent: this,
            bundles: (params && params.createBundles.map((c) => c(this))) || [],
            groupBy: params && params.groupBy,
            sort: params && params.sort,
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
        this.onCurrencyChangedImpl().catch((reason) => console.error(reason));
    }

    private async onCurrencyChangedImpl() {
        this.exchangeRate = undefined;
        // Status is intentionally ignored
        ({ result: this.exchangeRate } = await QueryUtility.execute(() => ExchangeRate.get(this.currency)));
    }
}
