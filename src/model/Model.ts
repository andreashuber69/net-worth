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
import { AssetGroup } from "./AssetGroup";
import { Currency } from "./Currency";
import { EnumInfo } from "./EnumInfo";
import { ExchangeRate } from "./ExchangeRate";

export type SortBy =
    typeof Asset.typeName | typeof Asset.descriptionName | typeof Asset.locationName |
    typeof Asset.unitValueName | typeof Asset.totalValueName;

export interface ISort {
    /** Provides the name of the property by which the asset list is currently sorted. */
    readonly by: SortBy;

    /** Provides a value indicating whether the sort order is descending. */
    readonly descending: boolean;
}

export interface ISerializedModel {
    version: number;
    name: string;
    wasSavedToFile: boolean;
    hasUnsavedChanges: boolean;
    currency: string;
    groupBy: GroupBy;
    sort: ISort;
    bundles: ISerializedBundle[];
}

/** Represents the main model of the application. */
export class Model implements IModel {
    /** Provides the property names by which the asset list can be grouped. */
    public static readonly groupBys: GroupBy[] = [ Asset.typeName, Asset.locationName ];

    public static isSortBy(sortBy: string | undefined): sortBy is SortBy {
        switch (sortBy) {
            case Asset.typeName:
            case Asset.descriptionName:
            case Asset.locationName:
            case Asset.unitValueName:
            case Asset.totalValueName:
                return true;
            default:
                return false;
        }
    }

    /** @internal */
    public readonly bundles = new Array<AssetBundle>();

    /** Provides the name of the asset collection. */
    public name = "Unnamed";

    /** Provides the file extension. */
    public readonly fileExtension = ".assets";

    public get fileName() {
        return `${this.name}${this.fileExtension}`;
    }

    public wasSavedToFile = false;

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
        this.onCurrencyChanged().catch((reason) => console.error(reason));
    }

    /** Provides the property names by which the asset list can be grouped. */
    public readonly groupBys = Model.groupBys;

    /** Provides the labels for the properties by which the asset list can be grouped. */
    public get groupByLabels() {
        return this.groupBys.map((g) => Model.capitalize(g));
    }

    /** Provides the name of the property by which the asset list is currently grouped. */
    public get groupBy() {
        return this.groupByImpl;
    }

    public set groupBy(groupBy: GroupBy) {
        this.groupByImpl = groupBy;
        this.groups.length = 0;
        this.update();
    }

    /** Provides the label for the property by which the asset list is currently grouped. */
    public get groupByLabel() {
        return Model.capitalize(this.groupBy);
    }

    /** Provides the property names by which the asset list is currently *not* grouped. */
    public get otherGroupBys() {
        const result = Array.from(this.groupBys);
        result.splice(result.indexOf(this.groupBy), 1);

        return result;
    }

    /** Provides the labels for the properties by which the asset list is currently *not* grouped. */
    public get otherGroupByLabels() {
        return this.otherGroupBys.map((g) => Model.capitalize(g));
    }

    /** Provides information on how to sort the asset list. */
    public get sort() {
        return this.sortImpl;
    }

    public set sort(sort: ISort) {
        this.sortImpl = sort;
        this.doSort();
    }

    /** Provides the asset groups. */
    public readonly groups = new Array<AssetGroup>();

    /** Provides the assets to value. */
    public get assets() {
        const result: Asset[] = [];

        for (const group of this.groups) {
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
        return this.groups.reduce<number | undefined>(
            (s, a) => s === undefined ? undefined : (a.totalValue === undefined ? undefined : s + a.totalValue), 0);
    }

    /** Provides the method that is called when the model has changed. */
    public onChanged: (() => void) | undefined = undefined;

    /** Returns a JSON-formatted string representing the model. */
    public toJsonString() {
        return JSON.stringify(this, undefined, 2);
    }

    /** Adds `bundle` to the list of asset bundles. */
    public addAsset(asset: Asset) {
        const bundle = asset.bundle();
        this.bundles.push(bundle);
        this.update(bundle);
        this.notifyChanged();
    }

    /** Deletes `asset`. */
    public deleteAsset(asset: Asset) {
        const index = this.bundles.findIndex((b) => b.assets.indexOf(asset) >= 0);

        if (index >= 0) {
            const bundle = this.bundles[index];
            bundle.deleteAsset(asset);

            if (bundle.assets.length === 0) {
                this.bundles.splice(index, 1);
            }

            this.update();
            this.notifyChanged();
        }
    }

    /** Replaces the bundle containing `oldAsset` with `newBundle`. */
    public replaceAsset(oldAsset: Asset, newAsset: Asset) {
        const index = this.bundles.findIndex((b) => b.assets.indexOf(oldAsset) >= 0);

        if (index >= 0) {
            const bundle = newAsset.bundle();
            // Apparently, Vue cannot detect the obvious way of replacing (this.bundles[index] = newBundle):
            // https://codingexplained.com/coding/front-end/vue-js/array-change-detection
            this.bundles.splice(index, 1, bundle);
            this.update(bundle);
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
            groupBy: this.groupBy,
            sort: this.sort,
            bundles: this.bundles.map((bundle) => bundle.toJSON()),
        };
    }

    /** @internal */
    public update(...newBundles: AssetBundle[]) {
        this.updateImpl(newBundles).catch((error) => console.error(error));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static capitalize(str: string) {
        return `${str[0].toUpperCase()}${str.substr(1)}`;
    }

    private static async queryBundleData(bundle: AssetBundle, id: number) {
        await bundle.queryData();

        return id;
    }

    private currencyImpl = this.currencies[0];

    private groupByImpl: GroupBy = Asset.typeName;

    private sortImpl: ISort = { by: Asset.totalValueName, descending: true };

    private hasUnsavedChangesImpl = false;

    private async updateImpl(newBundles: AssetBundle[]) {
        this.updateGroups();
        const promises = new Map<number, Promise<number>>(
            newBundles.map<[number, Promise<number>]>((b, i) => [ i, Model.queryBundleData(b, i) ]));
        const delayId = Number.MAX_SAFE_INTEGER;

        while (promises.size > 0) {
            if (!promises.has(delayId)) {
                promises.set(delayId, new Promise((resolve) => setTimeout(resolve, 1000, delayId)));
            }

            const index = await Promise.race(promises.values());

            if (index === delayId) {
                this.updateGroups();
            }

            promises.delete(index);
        }
    }

    private updateGroups() {
        const newGroups = this.group();

        // Remove no longer existing groups
        for (let index = 0; index < this.groups.length;) {
            if (!newGroups.has(this.groups[index][this.groupBy])) {
                this.groups.splice(index, 1);
            } else {
                ++index;
            }
        }

        // Update existing groups with new assets
        for (const newGroup of newGroups) {
            const existingGroup = this.groups.find((g) => g[this.groupBy] === newGroup[0]);

            if (existingGroup === undefined) {
                this.groups.push(new AssetGroup(this, newGroup[1]));
            } else {
                existingGroup.assets.splice(0, existingGroup.assets.length, ...newGroup[1]);
            }
        }

        this.doSort();
    }

    private group() {
        const result = new Map<string, Asset[]>();

        for (const bundle of this.bundles) {
            for (const asset of bundle.assets) {
                const groupName = asset[this.groupBy];
                const groupAssets = result.get(groupName);

                if (groupAssets === undefined) {
                    result.set(groupName, [ asset ]);
                } else {
                    groupAssets.push(asset);
                }
            }
        }

        return result;
    }

    private doSort() {
        this.groups.sort((l, r) => this.compare(l, r));

        for (const group of this.groups) {
            group.assets.sort((l, r) => this.compare(l, r));
        }
    }

    private compare(left: Asset, right: Asset) {
        return (this.sort.descending ? -1 : 1) * this.compareImpl(left, right);
    }

    private compareImpl(left: Asset, right: Asset) {
        const leftProperty = left[this.sort.by];
        const rightProperty = right[this.sort.by];

        if (leftProperty === rightProperty) {
            return 0;
        } else if (leftProperty === undefined) {
            return -1;
        } else if (rightProperty === undefined) {
            return 1;
        } else if (leftProperty < rightProperty) {
            return -1;
        } else {
            return 1;
        }
    }

    private async onCurrencyChanged() {
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
