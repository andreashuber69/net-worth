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
import { QueryCache } from "./QueryCache";
import { Value } from "./Value";

interface ITokenInfo {
    readonly contractAddress: string;
    readonly decimals: number;
    readonly cmcPath: string;
    readonly price: number;
}

/** Defines an ETH bundle. */
export class EthBundle extends AssetBundle {
    public readonly assets: Asset[];

    /**
     * Creates a new [[EthBundle]] instance.
     * @param asset The asset to bundle.
     */
    public constructor(private readonly address: string) {
        super();
        EthBundle.getTopTokens().catch((reason) => console.error(reason));
    }

    public deleteAsset(asset: Asset) {
        const index = this.assets.indexOf(asset);

        if (index >= 0) {
            this.assets.splice(index, 1);
        }
    }

    /** @internal */
    public toJSON() {
        return this.assets.map((asset) => asset.toJSON());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static async getTopTokens() {
        const knownTokens = await this.getKnownTokens();

        if (!knownTokens) {
            return undefined;
        }

        const currencies = await QueryCache.fetch("https://api.coinmarketcap.com/v2/ticker/");

        if (!Value.hasObjectProperty(currencies, "data")) {
            return undefined;
        }

        const data = currencies.data;
        const topTokens = new Map<string, ITokenInfo>();

        for (const id in data) {
            if (data.hasOwnProperty(id)) {
                if (!Value.isObject(data[id])) {
                    continue;
                }

                const ticker = data[id];

                if (!Value.hasStringProperty(ticker, "symbol") || !Value.hasStringProperty(ticker, "website_slug") ||
                    !Value.hasObjectProperty(ticker, "quotes") || !Value.hasObjectProperty(ticker.quotes, "USD")) {
                    continue;
                }

                const knownToken = knownTokens.get(ticker.symbol);

                if (!knownToken) {
                    continue;
                }

                const usdQuotes = ticker.quotes.USD;

                if (!Value.hasNumberProperty(usdQuotes, "price")) {
                    continue;
                }

                topTokens.set(ticker.symbol, {
                    contractAddress: knownToken.contractAddress,
                    decimals: knownToken.decimals,
                    cmcPath: ticker.website_slug,
                    price: usdQuotes.price,
                });
            }
        }

        return topTokens;
    }

    private static async getKnownTokens() {
        const knownTokens = await QueryCache.fetch(
            "https://raw.githubusercontent.com/kvhnuke/etherwallet/mercury/app/scripts/tokens/ethTokens.json");

        if (Value.isArray(knownTokens)) {
            const result = new Map<string, { contractAddress: string; decimals: number }>();

            for (const token of knownTokens) {
                if (Value.hasStringProperty(token, "address") && Value.hasStringProperty(token, "symbol") &&
                    Value.hasNumberProperty(token, "decimal")) {
                    result.set(token.symbol, { contractAddress: token.address, decimals: token.decimal });
                }
            }

            return result;
        }

        return undefined;
    }
}
