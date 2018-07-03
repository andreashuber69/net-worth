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

import { Asset, IModel } from "./Asset";
import { AssetBundle, ISerializedBundle } from "./AssetBundle";
import { AssetGroup } from "./AssetGroup";
import { AssetInputInfo } from "./AssetInputInfo";
import { BtcWallet } from "./BtcWallet";
import { BtcWalletInputInfo } from "./BtcWalletInputInfo";
import { CoinMarketCapRequest } from "./CoinMarketCapRequest";
import { EthWallet } from "./EthWallet";
import { EthWalletInputInfo } from "./EthWalletInputInfo";
import { GoldAsset } from "./GoldAsset";
import { IWebRequest } from "./IWebRequest";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import { QuandlRequest } from "./QuandlRequest";
import { SilverAsset } from "./SilverAsset";
import { Unknown, Value } from "./Value";

export type SortBy =
    typeof Asset.typeName | typeof Asset.descriptionName | typeof Asset.locationName | typeof Asset.totalValueName;

export interface ISort {
    /** Provides the name of the property by which the asset list is currently sorted. */
    readonly by: SortBy;

    /** Provides a value indicating whether the sort order is descending. */
    readonly descending: boolean;
}

export type GroupBy = typeof Asset.typeName | typeof Asset.locationName;

interface ISerializedModel {
    selectedCurrency: string;
    selectedGroupBy: GroupBy;
    sort: ISort;
    bundles: ISerializedBundle[];
}

/** Represents the main model of the application. */
export class Model implements IModel {
    /** Provides information objects for each of the supported asset types. */
    public static readonly assetInfos: AssetInputInfo[] = [
        new BtcWalletInputInfo(BtcWallet.type, BtcWallet),
        new EthWalletInputInfo(EthWallet.type, EthWallet),
        new PreciousMetalAssetInputInfo(SilverAsset.type, SilverAsset),
        new PreciousMetalAssetInputInfo(GoldAsset.type, GoldAsset),
    ];

    /**
     * Returns a [[Model]] object that is equivalent to the passed JSON string or returns a string that describes why
     * the parse process failed.
     * @description This is typically called with a string that was returned by [[toJsonString]].
     * @param json The string to parse
     * @param onChanged The handler to pass to the [[Model]] constructor.
     */
    public static parse(json: string) {
        let rawModel: Unknown | null;

        try {
            rawModel = JSON.parse(json) as Unknown | null;
        } catch (e) {
            return (e as Error).message;
        }

        const model = new Model();

        if (Value.hasStringProperty(rawModel, Model.selectedCurrencyName)) {
            const selectedCurrency = rawModel[Model.selectedCurrencyName];

            if (model.currencies.findIndex((currency) => currency === selectedCurrency) >= 0) {
                model.selectedCurrency = selectedCurrency;
            }
        }

        if (Value.hasStringProperty(rawModel, Model.selectedGroupByName)) {
            const selectedGroupBy = rawModel[Model.selectedGroupByName];

            if (model.isGroupBy(selectedGroupBy)) {
                model.selectedGroupBy = selectedGroupBy;
            }
        }

        if (Value.hasObjectProperty(rawModel, Model.sortName)) {
            const sort = rawModel[Model.sortName];

            if (Model.isSort(sort)) {
                model.sort = sort;
            }
        }

        if (!Value.hasArrayProperty(rawModel, Model.bundlesName)) {
            return Value.getPropertyTypeMismatch(Model.bundlesName, rawModel, []);
        }

        for (const rawBundle of rawModel.bundles) {
            const bundle = AssetBundle.parse(model, rawBundle);

            if (!(bundle instanceof AssetBundle)) {
                return bundle;
            }

            model.bundles.push(bundle);
        }

        model.update(...model.bundles);

        return model;
    }

    /** Provides the available currencies to value the assets in. */
    public get currencies() {
        return Array.from(Model.currencyMap.keys());
    }

    /** Provides the selected currency. */
    public get selectedCurrency() {
        return this.selectedCurrencyImpl;
    }

    /** Provides the selected currency. */
    public set selectedCurrency(currency: string) {
        this.selectedCurrencyImpl = currency;
        this.notifyChanged();
        this.onCurrencyChanged().catch((reason) => console.error(reason));
    }

    /** Provides the property names by which the asset list can be grouped. */
    public readonly groupBys: GroupBy[] = [ Asset.typeName, Asset.locationName ];

    /** Provides the name of the property by which the asset list is currently grouped. */
    public get selectedGroupBy() {
        return this.groupByImpl;
    }

    public set selectedGroupBy(groupBy: GroupBy) {
        this.groupByImpl = groupBy;
        this.groups.length = 0;
        this.update();
        this.notifyChanged();
    }

    /** Provides information on how to sort the asset list. */
    public get sort() {
        return this.sortImpl;
    }

    public set sort(sort: ISort) {
        this.sortImpl = sort;
        this.doSort();
        this.notifyChanged();
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
            selectedCurrency: this.selectedCurrency,
            selectedGroupBy: this.selectedGroupBy,
            sort: this.sort,
            bundles: this.bundles.map((bundle) => bundle.toJSON()),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly selectedCurrencyName = Model.getModelName("selectedCurrency");
    private static readonly selectedGroupByName = Model.getModelName("selectedGroupBy");
    private static readonly sortName = Model.getModelName("sort");
    private static readonly sortByName = Model.getSortName("by");
    private static readonly sortDescendingName = Model.getSortName("descending");
    private static readonly bundlesName = Model.getModelName("bundles");

    private static readonly currencyMap = new Map<string, IWebRequest<number>>([
        ["USD", new QuandlRequest("", false)],
        ["AUD", new QuandlRequest("boe/xudladd.json", false)],
        ["CAD", new QuandlRequest("boe/xudlcdd.json", false)],
        ["CNY", new QuandlRequest("boe/xudlbk73.json", false)],
        ["CHF", new QuandlRequest("boe/xudlsfd.json", false)],
        ["CZK", new QuandlRequest("boe/xudlbk27.json", false)],
        ["DKK", new QuandlRequest("boe/xudldkd.json", false)],
        ["GBP", new QuandlRequest("boe/xudlgbd.json", false)],
        ["HKD", new QuandlRequest("boe/xudlhdd.json", false)],
        ["HUF", new QuandlRequest("boe/xudlbk35.json", false)],
        ["INR", new QuandlRequest("boe/xudlbk64.json", false)],
        ["JPY", new QuandlRequest("boe/xudljyd.json", false)],
        ["KRW", new QuandlRequest("boe/xudlbk74.json", false)],
        ["LTL", new QuandlRequest("boe/xudlbk38.json", false)],
        ["MYR", new QuandlRequest("boe/xudlbk66.json", false)],
        ["NIS", new QuandlRequest("boe/xudlbk65.json", false)],
        ["NOK", new QuandlRequest("boe/xudlnkd.json", false)],
        ["NZD", new QuandlRequest("boe/xudlndd.json", false)],
        ["PLN", new QuandlRequest("boe/xudlbk49.json", false)],
        ["RUB", new QuandlRequest("boe/xudlbk69.json", false)],
        ["SAR", new QuandlRequest("boe/xudlsrd.json", false)],
        ["SEK", new QuandlRequest("boe/xudlskd.json", false)],
        ["SGD", new QuandlRequest("boe/xudlsgd.json", false)],
        ["THB", new QuandlRequest("boe/xudlbk72.json", false)],
        ["TRY", new QuandlRequest("boe/xudlbk75.json", false)],
        ["TWD", new QuandlRequest("boe/xudltwd.json", false)],
        ["ZAR", new QuandlRequest("boe/xudlzrd.json", false)],
        ["XAG", new QuandlRequest("lbma/silver.json", true)],
        ["XAU", new QuandlRequest("lbma/gold.json", true)],
        ["BTC", new CoinMarketCapRequest("bitcoin", true)],
    ]);

    private static getModelName<T extends keyof ISerializedModel>(name: T) {
        return name;
    }

    private static getSortName<T extends keyof ISort>(name: T) {
        return name;
    }

    private static isSort(sort: Unknown): sort is ISort {
        return Value.hasStringProperty(sort, Model.sortByName) && this.isSortBy(sort.by) &&
            Value.hasBooleanProperty(sort, Model.sortDescendingName);
    }

    private static isSortBy(sortBy: string): sortBy is SortBy {
        switch (sortBy) {
            case Asset.typeName:
            case Asset.descriptionName:
            case Asset.locationName:
            case Asset.totalValueName:
                return true;
            default:
                return false;
        }
    }

    private static async queryBundleData(bundle: AssetBundle, id: number) {
        await bundle.queryData();

        return id;
    }

    private readonly bundles = new Array<AssetBundle>();

    private selectedCurrencyImpl = Model.currencyMap.keys().next().value;

    private groupByImpl: GroupBy = Asset.typeName;

    private sortImpl: ISort = { by: Asset.totalValueName, descending: true };

    private isGroupBy(groupBy: string): groupBy is GroupBy {
        return this.groupBys.findIndex((g) => g === groupBy) >= 0;
    }

    private update(...newBundles: AssetBundle[]) {
        this.updateImpl(newBundles).catch((error) => console.error(error));
    }

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
            if (!newGroups.has(this.groups[index][this.selectedGroupBy])) {
                this.groups.splice(index, 1);
            } else {
                ++index;
            }
        }

        // Update existing groups with new assets
        for (const newGroup of newGroups) {
            const existingGroup = this.groups.find((g) => g[this.selectedGroupBy] === newGroup[0]);

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
                const groupName = asset[this.selectedGroupBy];
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
        const request = Model.currencyMap.get(this.selectedCurrency) as IWebRequest<number>;
        this.exchangeRate = await request.execute();
    }

    private notifyChanged() {
        if (this.onChanged) {
            this.onChanged();
        }
    }
}
