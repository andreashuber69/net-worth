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

import { Asset } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { BtcQuantityAsset } from "./BtcQuantityAsset";
import { WeigthUnit } from "./PreciousMetalAsset";
import { QuandlParser } from "./QuandlParser";
import { QuandlPriceInfo } from "./QuandlPriceInfo";
import { QueryCache } from "./QueryCache";
import { QueryIterator } from "./QueryIterator";
import { SilverAsset } from "./SilverAsset";

export class Model {
    public get currencies() {
        return Array.from(Model.currencyMap.keys());
    }

    public get selectedCurrency() {
        return this.selectedCurrencyImpl;
    }

    public set selectedCurrency(currency: string) {
        this.selectedCurrencyImpl = currency;
        this.currencyChanged().catch((reason) => console.error(reason));
    }

    public get assets() {
        return this.bundles.reduce((result, bundle) => result.concat(bundle.assets), new Array<Asset>());
    }

    /** @internal */
    public exchangeRate: number | undefined = 1;

    /** @internal */
    public constructor() {
        Model.update(this.assets);
    }

    /** @internal */
    public add(bundle: AssetBundle) {
        this.bundles.push(bundle);
        Model.update(bundle.assets);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // TODO: Extend with XAU, XAG and BTC
    private static readonly currencyMap = new Map<string, QuandlPriceInfo>([
        ["USD", new QuandlPriceInfo("", false)],
        ["AUD", new QuandlPriceInfo("boe/xudladd.json", false)],
        ["CAD", new QuandlPriceInfo("boe/xudlcdd.json", false)],
        ["CNY", new QuandlPriceInfo("boe/xudlbk73.json", false)],
        ["CHF", new QuandlPriceInfo("boe/xudlsfd.json", false)],
        ["CZK", new QuandlPriceInfo("boe/xudlbk27.json", false)],
        ["DKK", new QuandlPriceInfo("boe/xudldkd.json", false)],
        ["GBP", new QuandlPriceInfo("boe/xudlgbd.json", false)],
        ["HKD", new QuandlPriceInfo("boe/xudlhdd.json", false)],
        ["HUF", new QuandlPriceInfo("boe/xudlbk35.json", false)],
        ["INR", new QuandlPriceInfo("boe/xudlbk64.json", false)],
        ["JPY", new QuandlPriceInfo("boe/xudljyd.json", false)],
        ["KRW", new QuandlPriceInfo("boe/xudlbk74.json", false)],
        ["LTL", new QuandlPriceInfo("boe/xudlbk38.json", false)],
        ["MYR", new QuandlPriceInfo("boe/xudlbk66.json", false)],
        ["NIS", new QuandlPriceInfo("boe/xudlbk65.json", false)],
        ["NOK", new QuandlPriceInfo("boe/xudlnkd.json", false)],
        ["NZD", new QuandlPriceInfo("boe/xudlndd.json", false)],
        ["PLN", new QuandlPriceInfo("boe/xudlbk49.json", false)],
        ["RUB", new QuandlPriceInfo("boe/xudlbk69.json", false)],
        ["SAR", new QuandlPriceInfo("boe/xudlsrd.json", false)],
        ["SEK", new QuandlPriceInfo("boe/xudlskd.json", false)],
        ["SGD", new QuandlPriceInfo("boe/xudlsgd.json", false)],
        ["THB", new QuandlPriceInfo("boe/xudlbk72.json", false)],
        ["TRY", new QuandlPriceInfo("boe/xudlbk75.json", false)],
        ["TWD", new QuandlPriceInfo("boe/xudltwd.json", false)],
        ["ZAR", new QuandlPriceInfo("boe/xudlzrd.json", false)],
        ["XAG", new QuandlPriceInfo("lbma/silver.json", true)],
    ]);

    // tslint:disable-next-line:max-line-length
    private static readonly address = "1F8i3SE7Zorf6F2rLh3Mxg4Mb8aHT2nkQf";

    private static update(assets: Asset[]) {
        this.updateImpl(assets).catch((reason) => console.error(reason));
    }

    private static async updateImpl(assets: Asset[]) {
        const iterators = Model.createIterators(assets);

        while (iterators.size > 0) {
            const doneAssets = new Array<Asset>();

            for (const [asset, queryIterator] of iterators) {
                if (queryIterator.value) {
                    asset.processCurrentQueryResponse(await QueryCache.fetch(queryIterator.value));
                    queryIterator.advance();
                } else {
                    doneAssets.push(asset);
                }
            }

            for (const asset of doneAssets) {
                iterators.delete(asset);
            }
        }
    }

    private static createIterators(assets: Asset[]) {
        const result = new Map<Asset, QueryIterator>();

        for (const asset of assets) {
            result.set(asset, new QueryIterator(asset.queries));
        }

        return result;
    }

    private static async getExchangeRate(quandlId: string) {
        if (quandlId.length > 0) {
            const response = await QueryCache.fetch(
                `https://www.quandl.com/api/v3/datasets/${quandlId}?api_key=ALxMkuJx2XTUqsnsn6qK&rows=1`);

            return QuandlParser.getPrice(response);
        } else {
            return 1;
        }
    }

    private readonly bundles = [
        new AssetBundle(new SilverAsset(this, "Home", "5 CHF, Roll of 50", WeigthUnit.Gram, 750, 0.835, 1)),
        new AssetBundle(new SilverAsset(this, "Home", "2 CHF, Roll of 50", WeigthUnit.Gram, 500, 0.835, 2)),
        new AssetBundle(new SilverAsset(this, "Home", "1 CHF, Roll of 50", WeigthUnit.Gram, 250, 0.835, 3)),
        new AssetBundle(new SilverAsset(this, "Home", "0.5 CHF, Roll of 50", WeigthUnit.Gram, 125, 0.835, 4)),
        new AssetBundle(new BtcQuantityAsset(this, Model.address, "Spending Wallet")),
    ];

    private selectedCurrencyImpl = Model.currencyMap.keys().next().value;

    private async currencyChanged() {
        this.exchangeRate = undefined;
        const info = Model.currencyMap.get(this.selectedCurrency) as QuandlPriceInfo;
        const rate = await Model.getExchangeRate(info.location);
        this.exchangeRate = info.invert ? 1 / rate : rate;
    }
}
