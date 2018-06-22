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
import { AssetBundle } from "./AssetBundle";
import { AssetGroup } from "./AssetGroup";
import { AssetInputInfo } from "./AssetInputInfo";
import { IAllAssetProperties } from "./AssetInterfaces";
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

export type SortableProperties = "type" | "description" | "location" | "totalValue";
export type SortBy = "" | SortableProperties;

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
    public static parse(json: string, onChanged: () => void) {
        let rawModel: Unknown | null;

        try {
            rawModel = JSON.parse(json) as Unknown | null;
        } catch (e) {
            return (e as Error).message;
        }

        const selectedCurrencyName = "selectedCurrency";

        if (!Value.hasStringProperty(rawModel, selectedCurrencyName)) {
            return Value.getPropertyTypeMismatch(selectedCurrencyName, rawModel, "");
        }

        const model = new Model(onChanged);
        const selectedCurrency = rawModel[selectedCurrencyName];

        if (model.currencies.findIndex((currency) => currency === selectedCurrency) < 0) {
            return Value.getUnknownValue(selectedCurrencyName, selectedCurrency);
        }

        const bundlesName = "bundles";

        if (!Value.hasArrayProperty(rawModel, bundlesName)) {
            return Value.getPropertyTypeMismatch(bundlesName, rawModel, []);
        }

        model.selectedCurrency = selectedCurrency;

        const primaryAssetName = "primaryAsset";

        for (const rawBundle of rawModel.bundles) {
            if (!Value.hasObjectProperty(rawBundle, primaryAssetName)) {
                return Value.getPropertyTypeMismatch(primaryAssetName, rawBundle, {});
            }

            const rawAsset = rawBundle[primaryAssetName];
            const asset = Model.parseAsset(model, rawAsset);

            if (!(asset instanceof Asset)) {
                return asset;
            }

            model.bundles.push(asset.bundle(rawBundle));
        }

        model.queryBundleData(model.bundles);

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
        this.onCurrencyChanged().catch((reason) => console.error(reason));
    }

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

    // tslint:disable-next-line:no-empty
    public constructor(private readonly onChanged: () => void) {
    }

    /** Returns a JSON-formatted string representing the model. */
    public toJsonString() {
        return JSON.stringify(this, undefined, 2);
    }

    /** Adds `bundle` to the list of asset bundles. */
    public addAsset(asset: Asset) {
        const bundle = asset.bundle();
        this.queryBundleData([ bundle ]);
        this.bundles.push(bundle);
        this.onChanged();
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
        }

        this.onChanged();
    }

    /** Replaces the bundle containing `oldAsset` with `newBundle`. */
    public replaceAsset(oldAsset: Asset, newAsset: Asset) {
        const index = this.bundles.findIndex((b) => b.assets.indexOf(oldAsset) >= 0);

        if (index >= 0) {
            const bundle = newAsset.bundle();
            this.queryBundleData([ bundle ]);
            // Apparently, Vue cannot detect the obvious way of replacing (this.bundles[index] = newBundle):
            // https://codingexplained.com/coding/front-end/vue-js/array-change-detection
            this.bundles.splice(index, 1, bundle);
        }

        this.onChanged();
    }

    public sort(sortBy: SortBy, descending: boolean) {
        if (sortBy !== "") {
            this.groups.sort((a, b) => Model.compare(a, b, sortBy, descending));

            for (const group of this.groups) {
                group.assets.sort((a, b) => Model.compare(a, b, sortBy, descending));
            }
        }
    }

    /** @internal */
    public toJSON() {
        return {
            selectedCurrency: this.selectedCurrency,
            bundles: this.bundles.map((bundle) => bundle.toJSON()),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    private static parseAsset(model: IModel, rawAsset: Unknown | null | undefined) {
        const typeName = "type";

        if (!Value.hasStringProperty(rawAsset, typeName)) {
            return Value.getPropertyTypeMismatch(typeName, rawAsset, "");
        }

        const assetInfo = this.assetInfos.find((info) => info.type === rawAsset.type);

        if (!assetInfo) {
            return Value.getUnknownValue(typeName, rawAsset.type);
        }

        const validationResult = assetInfo.validateAll(rawAsset);

        if (!this.hasProperties(validationResult, rawAsset)) {
            return validationResult;
        }

        return assetInfo.createAsset(model, rawAsset);
    }

    private static hasProperties(validationResult: true | string, raw: Unknown): raw is IAllAssetProperties {
        return validationResult === true;
    }

    private static compare(left: Asset, right: Asset, sortBy: SortableProperties, descending: boolean) {
        return (descending ? -1 : 1) * this.compareImpl(left, right, sortBy);
    }

    private static compareImpl(left: Asset, right: Asset, sortBy: SortableProperties) {
        const leftProperty = left[sortBy];
        const rightProperty = right[sortBy];

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

    private readonly bundles = new Array<AssetBundle>();

    private selectedCurrencyImpl = Model.currencyMap.keys().next().value;

    private queryBundleData(bundles: AssetBundle[]) {
        this.queryBundleDataImpl(bundles).catch((error) => console.log(error));
    }

    private async queryBundleDataImpl(bundles: AssetBundle[]) {
        await Promise.all(bundles.map((b) => b.queryData()));
        const groupBy = "type";
        const newGroups = this.group(groupBy);

        // Remove no longer existing groups
        for (let index = 0; index < this.groups.length;) {
            if (!newGroups.has(this.groups[index][groupBy])) {
                this.groups.splice(index, 1);
            } else {
                ++index;
            }
        }

        // Update existing groups with new assets
        for (const newGroup of newGroups) {
            const existingGroup = this.groups.find((g) => g[groupBy] === newGroup[0]);

            if (existingGroup === undefined) {
                this.groups.push(new AssetGroup(this, newGroup[1]));
            } else {
                existingGroup.assets.splice(0, existingGroup.assets.length, ...newGroup[1]);
            }
        }
    }

    private group(groupBy: "type") {
        const result = new Map<string, Asset[]>();

        for (const bundle of this.bundles) {
            for (const asset of bundle.assets) {
                const groupName = asset[groupBy];
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

    private async onCurrencyChanged() {
        this.exchangeRate = undefined;
        const request = Model.currencyMap.get(this.selectedCurrency) as IWebRequest<number>;
        this.exchangeRate = await request.execute();
    }
}
