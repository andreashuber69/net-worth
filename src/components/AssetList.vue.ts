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
import { CryptoAssetInfo } from "./CryptoAssetInfo";
import { WeigthUnit } from "./PreciousMetalInfo";
import { QueryIterator } from "./QueryIterator";
import { SilverInfo } from "./SilverInfo";

// tslint:disable-next-line:no-unsafe-any
@Component({ components: { Asset } })
// tslint:disable-next-line:no-default-export no-unsafe-any
export default class AssetList extends Vue {
    public bundles: AssetBundle[] = [
        new AssetBundle(new SilverInfo("Home", "5 CHF, Roll of 50", 1, WeigthUnit.Gram, 750, 0.835)),
        new AssetBundle(new SilverInfo("Home", "2 CHF, Roll of 50", 2, WeigthUnit.Gram, 500, 0.835)),
        new AssetBundle(new SilverInfo("Home", "1 CHF, Roll of 50", 3, WeigthUnit.Gram, 250, 0.835)),
        new AssetBundle(new SilverInfo("Home", "0.5 CHF, Roll of 50", 4, WeigthUnit.Gram, 125, 0.835)),
        new AssetBundle(new CryptoAssetInfo(AssetList.address, "Spending Wallet", "BTC")),
    ];

    public get assets() {
        return this.bundles.reduce((result, bundle) => result.concat(bundle.assets), new Array<AssetInfo>());
    }

    public async mounted() {
        const iterators = AssetList.createIterators(this.assets);

        while (iterators.size > 0) {
            const queries = AssetList.getQueries(iterators);

            for (const [query, assets] of queries) {
                const response = await (await window.fetch(query)).text();

                for (const asset of assets) {
                    asset.processCurrentQueryResponse(response);
                    (iterators.get(asset) as QueryIterator).advance();
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:max-line-length
    private static readonly address = "1F8i3SE7Zorf6F2rLh3Mxg4Mb8aHT2nkQf";

    private static createIterators(assets: AssetInfo[]) {
        const result = new Map<AssetInfo, QueryIterator>();

        for (const asset of assets) {
            result.set(asset, new QueryIterator(asset.queries));
        }

        return result;
    }

    private static getQueries(queryIterators: Map<AssetInfo, QueryIterator>): Map<string, AssetInfo[]> {
        const queries = new Map<string, AssetInfo[]>();
        const doneAssets = new Array<AssetInfo>();

        for (const [asset, queryIterator] of queryIterators) {
            if (queryIterator.value) {
                let equalQueryAssets = queries.get(queryIterator.value);

                if (!equalQueryAssets) {
                    equalQueryAssets = new Array<AssetInfo>();
                    queries.set(queryIterator.value, equalQueryAssets);
                }

                equalQueryAssets.push(asset);
            } else {
                doneAssets.push(asset);
            }
        }

        for (const asset of doneAssets) {
            queryIterators.delete(asset);
            asset.processValue();
        }

        return queries;
    }
}
