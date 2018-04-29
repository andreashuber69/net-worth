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
    private static readonly currencyMap = new Map<string, string>([
        ["USD", ""],
        ["AUD", "boe/xudladd"],
        ["CAD", "boe/xudlcdd"],
        ["CNY", "boe/xudlbk73"],
        ["CHF", "boe/xudlsfd"],
        ["CZK", "boe/xudlbk27"],
        ["DKK", "boe/xudldkd"],
        ["GBP", "boe/xudlgbd"],
        ["HKD", "boe/xudlhdd"],
        ["HUF", "boe/xudlbk35"],
        ["INR", "boe/xudlbk64"],
        ["JPY", "boe/xudljyd"],
        ["KRW", "boe/xudlbk74"],
        ["LTL", "boe/xudlbk38"],
        ["MYR", "boe/xudlbk66"],
        ["NIS", "boe/xudlbk65"],
        ["NOK", "boe/xudlnkd"],
        ["NZD", "boe/xudlndd"],
        ["PLN", "boe/xudlbk49"],
        ["RUB", "boe/xudlbk69"],
        ["SAR", "boe/xudlsrd"],
        ["SEK", "boe/xudlskd"],
        ["SGD", "boe/xudlsgd"],
        ["THB", "boe/xudlbk72"],
        ["TRY", "boe/xudlbk75"],
        ["TWD", "boe/xudltwd"],
        ["ZAR", "boe/xudlzrd"],
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
        this.exchangeRate = await Model.getExchangeRate(Model.currencyMap.get(this.selectedCurrency) as string);
    }
}
