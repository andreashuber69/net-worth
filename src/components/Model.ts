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

import { AssetBundle } from "./AssetBundle";
import { AssetInfo } from "./AssetInfo";
import { BtcQuantityInfo } from "./BtcQuantityInfo";
import { WeigthUnit } from "./PreciousMetalInfo";
import { QuandlParser } from "./QuandlParser";
import { QueryCache } from "./QueryCache";
import { QueryIterator } from "./QueryIterator";
import { SilverInfo } from "./SilverInfo";

export class Model {
    public get currencies() {
        return Array.from(Model.currencyMap.keys());
    }

    public get selectedCurrency() {
        return this.selectedCurrencyImpl;
    }

    public set selectedCurrency(currency: string) {
        this.selectedCurrencyImpl = currency;
        this.currencyChanged().catch((reason) => console.log(reason));
    }

    public get assets() {
        return this.bundles.reduce((result, bundle) => result.concat(bundle.assets), new Array<AssetInfo>());
    }

    /** @internal */
    public exchangeRate: number | undefined = 1;

    /** @internal */
    public add(bundle: AssetBundle) {
        this.bundles.push(bundle);

        return Model.update(bundle.assets);
    }

    /** @internal */
    public update() {
        return Model.update(this.assets);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // TODO: Extend with XAU, XAG and BTC
    private static readonly currencyMap = new Map<string, string>([
        ["USD", ""],
        ["AUD", "XUDLADD"],
        ["CAD", "XUDLCDD"],
        ["CNY", "XUDLBK73"],
        ["CHF", "XUDLSFD"],
        ["CZK", "XUDLBK27"],
        ["DKK", "XUDLDKD"],
        ["GBP", "XUDLGBD"],
        ["HKD", "XUDLHDD"],
        ["HUF", "XUDLBK35"],
        ["INR", "XUDLBK64"],
        ["JPY", "XUDLJYD"],
        ["KRW", "XUDLBK74"],
        ["LTL", "XUDLBK38"],
        ["MYR", "XUDLBK66"],
        ["NIS", "XUDLBK65"],
        ["NOK", "XUDLNKD"],
        ["NZD", "XUDLNDD"],
        ["PLN", "XUDLBK49"],
        ["RUB", "XUDLBK69"],
        ["SAR", "XUDLSRD"],
        ["SEK", "XUDLSKD"],
        ["SGD", "XUDLSGD"],
        ["THB", "XUDLBK72"],
        ["TRY", "XUDLBK75"],
        ["TWD", "XUDLTWD"],
        ["ZAR", "XUDLZRD"],
    ]);

    // tslint:disable-next-line:max-line-length
    private static readonly address = "1F8i3SE7Zorf6F2rLh3Mxg4Mb8aHT2nkQf";

    private static async update(assets: AssetInfo[]) {
        const iterators = Model.createIterators(assets);

        while (iterators.size > 0) {
            const doneAssets = new Array<AssetInfo>();

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

    private static createIterators(assets: AssetInfo[]) {
        const result = new Map<AssetInfo, QueryIterator>();

        for (const asset of assets) {
            result.set(asset, new QueryIterator(asset.queries));
        }

        return result;
    }

    private static async getExchangeRate(quandlId: string) {
        if (quandlId.length > 0) {
            const response = await QueryCache.fetch(
                `https://www.quandl.com/api/v3/datasets/BOE/${quandlId}?api_key=ALxMkuJx2XTUqsnsn6qK&rows=1`);

            return QuandlParser.getPrice(response);
        } else {
            return 1;
        }
    }

    private readonly bundles = [
        new AssetBundle(new SilverInfo(this, "Home", "5 CHF, Roll of 50", WeigthUnit.Gram, 750, 0.835, 1)),
        new AssetBundle(new SilverInfo(this, "Home", "2 CHF, Roll of 50", WeigthUnit.Gram, 500, 0.835, 2)),
        new AssetBundle(new SilverInfo(this, "Home", "1 CHF, Roll of 50", WeigthUnit.Gram, 250, 0.835, 3)),
        new AssetBundle(new SilverInfo(this, "Home", "0.5 CHF, Roll of 50", WeigthUnit.Gram, 125, 0.835, 4)),
        new AssetBundle(new BtcQuantityInfo(this, Model.address, "Spending Wallet")),
    ];

    private selectedCurrencyImpl = Model.currencyMap.keys().next().value;

    private async currencyChanged() {
        this.exchangeRate = undefined;
        this.exchangeRate = await Model.getExchangeRate(Model.currencyMap.get(this.selectedCurrency) as string);
    }
}
