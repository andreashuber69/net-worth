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
import { BtcWallet } from "./BtcWallet";
import { CoinMarketCapRequest } from "./CoinMarketCapRequest";
import { CryptoWallet, ICryptoWalletProperties } from "./CryptoWallet";
import { IWebRequest } from "./IWebRequest";
import { IPreciousMetalAssetProperties, PreciousMetalAsset } from "./PreciousMetalAsset";
import { QuandlRequest } from "./QuandlRequest";
import { SilverAsset } from "./SilverAsset";
import { WeightUnit } from "./WeightUnit";

interface IStringIndexable {
    [key: string]: any;
}

interface ICryptoWalletConstructor {
    new (parent: IModel, properties: ICryptoWalletProperties): CryptoWallet;
}

interface IPreciousMetalAssetConstructor {
    new (parent: IModel, properties: IPreciousMetalAssetProperties): PreciousMetalAsset;
}

/** Represents the main model of the application. */
export class Model implements IModel {
    public static parse(json: string) {
        const rawModel = JSON.parse(json);
        const model = new Model();

        if (rawModel instanceof Array) {
            for (const rawBundle of rawModel) {
                if (rawBundle instanceof Array) {
                    const bundle = new AssetBundle();

                    for (const rawAsset of rawBundle) {
                        const asset = Model.createAsset(model, rawAsset);

                        if (asset) {
                            bundle.assets.push(asset);
                        }
                    }

                    if (bundle.assets.length > 0) {
                        model.addAsset(bundle);
                    }
                }
            }
        }

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

    /** Provides the assets to value. */
    public get assets() {
        return this.bundles.reduce((result, bundle) => result.concat(bundle.assets), new Array<Asset>());
    }

    /** @internal */
    public exchangeRate: number | undefined = 1;

    /** @internal */
    public addAsset(bundle: AssetBundle) {
        this.bundles.push(bundle);
    }

    /** @internal */
    public deleteAsset(asset: Asset) {
        for (const bundle of this.bundles) {
            bundle.deleteAsset(asset);
        }
    }

    /** @internal */
    public replaceAsset(oldAsset: Asset, newAsset: Asset) {
        for (const bundle of this.bundles) {
            bundle.replaceAsset(oldAsset, newAsset);
        }
    }

    /** @internal */
    public toJSON() {
        return this.bundles.map((bundle) => bundle.toJSON());
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

    private static createAsset(model: IModel, rawAsset: any) {
        if (Model.hasStringIndexer(rawAsset)) {
            if (Model.hasTypeMember(rawAsset)) {
                switch (rawAsset.type) {
                    case BtcWallet.type:
                        return this.createCryptoWallet(model, rawAsset, BtcWallet);
                    case SilverAsset.type:
                        return this.createPreciousMetalAsset(model, rawAsset, SilverAsset);
                    default:
                }
            }
        }

        return undefined;
    }

    private static hasStringIndexer(value: any): value is IStringIndexable {
        return value instanceof Object;
    }

    private static hasTypeMember(value: IStringIndexable): value is { type: string } {
        return typeof value.type === "string";
    }

    private static createCryptoWallet(model: IModel, raw: IStringIndexable, ctor: ICryptoWalletConstructor) {
        if (!this.hasCryptoWalletProperties(raw) || (!raw.address === !raw.quantity) ||
            (raw.quantity && (raw.quantity <= 0))) {
            return undefined;
        }

        return new ctor(model, raw);
    }

    private static createPreciousMetalAsset(
        model: IModel, raw: IStringIndexable, ctor: IPreciousMetalAssetConstructor) {
        if (!this.hasPreciousMetalAssetProperties(raw) || (raw.weight <= 0) || !WeightUnit[raw.weightUnit] ||
            (raw.fineness < 0.5) || (raw.fineness > 0.999999) || (!raw.quantity) || (raw.quantity <= 0) ||
            (raw.quantity % 1 !== 0)) {
            return undefined;
        }

        return new ctor(model, raw);
    }

    private static hasCryptoWalletProperties(value: IStringIndexable): value is ICryptoWalletProperties {
        const quantityType = typeof value.quantity;

        return (typeof value.description === "string") && (typeof value.location === "string") &&
            (typeof value.address === "string") && ((quantityType === "number") || (quantityType === "undefined"));
    }

    private static hasPreciousMetalAssetProperties(value: IStringIndexable): value is IPreciousMetalAssetProperties {
        return (typeof value.description === "string") && (typeof value.location === "string") &&
            (typeof value.weight === "number") && (typeof value.weightUnit === "number") &&
            (typeof value.fineness === "number") && (typeof value.quantity === "number");
    }

    private readonly bundles = new Array<AssetBundle>();

    private selectedCurrencyImpl = Model.currencyMap.keys().next().value;

    private async onCurrencyChanged() {
        this.exchangeRate = undefined;
        const request = Model.currencyMap.get(this.selectedCurrency) as IWebRequest<number>;
        this.exchangeRate = await request.execute();
    }
}
