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

import { Application } from "./Application";
import { Asset, GroupBy, IModel } from "./Asset";
import { AssetBundle, ISerializedBundle } from "./AssetBundle";
import { Currency } from "./Currency";
import { EnumInfo } from "./EnumInfo";
import { ExchangeRate } from "./ExchangeRate";
import { GroupingImpl } from "./GroupingImpl";
import { ISort } from "./Ordering";

export interface IModelParameters {
    readonly name?: string;
    readonly wasSavedToFile?: boolean;
    readonly hasUnsavedChanges?: boolean;
    readonly currency?: keyof typeof Currency;
    readonly groupBy?: GroupBy;
    readonly sort?: ISort;
    readonly createBundles: Array<(model: IModel) => AssetBundle>;
}

export interface ISerializedModel {
    readonly version: number;
    readonly name: string;
    readonly wasSavedToFile: boolean;
    readonly hasUnsavedChanges: boolean;
    readonly currency: string;
    readonly groupBy: GroupBy;
    readonly sort: ISort;
    readonly bundles: ISerializedBundle[];
}

/** Represents the main model of the application. */
export class Model implements IModel {
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
        return EnumInfo.getMemberNames(Currency);
    }

    /** Provides the selected currency. */
    public get currency() {
        return this.currencyImpl;
    }

    /** Provides the selected currency. */
    public set currency(currency: keyof typeof Currency) {
        this.currencyImpl = currency;
        this.onCurrencyChanged();
    }

    public get ordering() {
        return this.groupingImpl.ordering;
    }

    public get isEmpty() {
        return this.groupingImpl.groups.length === 0;
    }

    /** Provides the assets to value. */
    public get assets() {
        const result: Asset[] = [];

        for (const group of this.groupingImpl.groups) {
            result.push(group);

            if (group.isExpanded) {
                result.push(...group.assets);
            }
        }

        return result;
    }

    /**
     * Provides the USD exchange rate of the currently selected currency (USDXXX, where XXX is the currently selected
     * currency).
     */
    public exchangeRate: number | undefined = 1;

    /** Provides the sum of all asset total values. */
    public get grandTotalValue() {
        return this.groupingImpl.groups.reduce<number | undefined>(
            (s, a) => s === undefined ? undefined : (a.totalValue === undefined ? undefined : s + a.totalValue), 0);
    }

    /** Provides the method that is called when the model has changed. */
    public onChanged: (() => void) | undefined = undefined;

    public constructor(params?: IModelParameters) {
        this.name = (params && params.name) || "Unnamed";
        this.wasSavedToFile = (params && params.wasSavedToFile) || false;
        this.hasUnsavedChangesImpl = (params && params.hasUnsavedChanges) || false;
        this.currencyImpl = (params && params.currency) || this.currencies[0];
        this.onCurrencyChanged();
        this.groupingImpl = new GroupingImpl({
            model: this,
            bundles: (params && params.createBundles.map((c) => c(this))) || [],
            groupBy: params && params.groupBy,
            sort: params && params.sort,
        });
    }

    /** Returns a JSON-formatted string representing the model. */
    public toJsonString() {
        return JSON.stringify(this, undefined, 2);
    }

    /** Adds `bundle` to the list of asset bundles. */
    public addAsset(asset: Asset) {
        const bundle = asset.bundle();
        this.groupingImpl.bundles.push(bundle);
        this.groupingImpl.update(bundle);
        this.notifyChanged();
    }

    /** Deletes `asset`. */
    public deleteAsset(asset: Asset) {
        const index = this.groupingImpl.bundles.findIndex((b) => b.assets.indexOf(asset) >= 0);

        if (index >= 0) {
            const bundle = this.groupingImpl.bundles[index];
            bundle.deleteAsset(asset);

            if (bundle.assets.length === 0) {
                this.groupingImpl.bundles.splice(index, 1);
            }

            this.groupingImpl.update();
            this.notifyChanged();
        }
    }

    /** Replaces the bundle containing `oldAsset` with a bundle containing `newAsset`. */
    public replaceAsset(oldAsset: Asset, newAsset: Asset) {
        const index = this.groupingImpl.bundles.findIndex((b) => b.assets.indexOf(oldAsset) >= 0);

        if (index >= 0) {
            const bundle = newAsset.bundle();
            // Apparently, Vue cannot detect the obvious way of replacing (this.bundles[index] = bundle):
            // https://codingexplained.com/coding/front-end/vue-js/array-change-detection
            this.groupingImpl.bundles.splice(index, 1, bundle);
            this.groupingImpl.update(bundle);
            this.notifyChanged();
        }
    }

    /** @internal */
    public toJSON(): ISerializedModel {
        return {
            version: 1,
            name: this.name,
            wasSavedToFile: this.wasSavedToFile,
            hasUnsavedChanges: this.hasUnsavedChanges,
            currency: this.currency,
            groupBy: this.ordering.groupBy,
            sort: this.ordering.sort,
            bundles: this.groupingImpl.bundles.map((bundle) => bundle.toJSON()),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly groupingImpl: GroupingImpl;

    private hasUnsavedChangesImpl: boolean;

    private currencyImpl: keyof typeof Currency;

    private onCurrencyChanged() {
        this.onCurrencyChangedImpl().catch((reason) => console.error(reason));
    }

    private async onCurrencyChangedImpl() {
        this.exchangeRate = undefined;
        this.exchangeRate = await ExchangeRate.get(Currency[this.currency]);
    }

    private notifyChanged() {
        this.hasUnsavedChangesImpl = true;

        if (this.onChanged) {
            this.onChanged();
        }
    }
}
