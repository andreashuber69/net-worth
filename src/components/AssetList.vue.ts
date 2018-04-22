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

import { Component, Vue } from "vue-property-decorator";
import Asset from "./Asset.vue";
import { AssetBundle } from "./AssetBundle";
import { AssetInfo } from "./AssetInfo";
import { BtcQuantityInfo } from "./BtcQuantityInfo";
import { WeigthUnit } from "./PreciousMetalInfo";
import { QuandlParser } from "./QuandlParser";
import { QueryCache } from "./QueryCache";
import { QueryIterator } from "./QueryIterator";
import { SilverInfo } from "./SilverInfo";

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { Asset } })
// tslint:disable-next-line:no-default-export no-unsafe-any
export default class AssetList extends Vue {
    public get currencies() {
        return Array.from(AssetList.currencyMap.keys());
    }

    public selectedCurrency = "USD";

    public get assets() {
        return this.bundles.reduce((result, bundle) => result.concat(bundle.assets), new Array<AssetInfo>());
    }

    public get totalValueInteger() {
        return AssetInfo.formatInteger(this.totalValue);
    }

    public get totalValueFraction() {
        return AssetInfo.formatFraction(this.totalValue, 2);
    }

    public mounted() {
        return AssetList.update(this.assets);
    }

    public add() {
        const bundle = new AssetBundle(new SilverInfo("Home", "Bars", WeigthUnit.Kilogram, 1, 0.999, 3));
        this.bundles.push(bundle);

        return AssetList.update(bundle.assets);
    }

    public async currencyChanged() {
        const rate = await AssetList.getExchangeRate(AssetList.currencyMap.get(this.selectedCurrency) as string);

        for (const asset of this.assets) {
            asset.exchangeRate = rate;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly currencyMap = new Map<string, string>([
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
        ["USD", ""],
        ["ZAR", "XUDLZRD"],
    ]);

    // tslint:disable-next-line:max-line-length
    private static readonly address = "1F8i3SE7Zorf6F2rLh3Mxg4Mb8aHT2nkQf";

    private static async update(assets: AssetInfo[]) {
        const iterators = AssetList.createIterators(assets);

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
            const response = await QueryCache.fetch(`https://www.quandl.com/api/v3/datasets/BOE/${quandlId}?rows=1`);

            return QuandlParser.getPrice(response);
        } else {
            return 1;
        }
    }

    private readonly bundles = [
        new AssetBundle(new SilverInfo("Home", "5 CHF, Roll of 50", WeigthUnit.Gram, 750, 0.835, 1)),
        new AssetBundle(new SilverInfo("Home", "2 CHF, Roll of 50", WeigthUnit.Gram, 500, 0.835, 2)),
        new AssetBundle(new SilverInfo("Home", "1 CHF, Roll of 50", WeigthUnit.Gram, 250, 0.835, 3)),
        new AssetBundle(new SilverInfo("Home", "0.5 CHF, Roll of 50", WeigthUnit.Gram, 125, 0.835, 4)),
        new AssetBundle(new BtcQuantityInfo(AssetList.address, "Spending Wallet")),
    ];

    private get totalValue() {
        return this.assets.reduce<number | undefined>(
            (s, a) => s === undefined ? a.totalValue : s + (a.totalValue === undefined ? 0 : a.totalValue), undefined);
    }
}
