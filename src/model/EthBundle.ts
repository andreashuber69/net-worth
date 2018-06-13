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
import { ICryptoWalletProperties } from "./CryptoWallet";
import { Erc20TokenWallet } from "./Erc20TokenWallet";
import { EtherscanTokenBalanceRequest } from "./EtherscanTokenBalanceRequest";
import { EthWallet } from "./EthWallet";
import { QueryCache } from "./QueryCache";
import { Unknown, Value } from "./Value";

interface ITokenInfo {
    readonly contractAddress: string;
    readonly decimals: number;
}

/** Defines an ETH bundle. */
export class EthBundle extends AssetBundle {
    public readonly assets: Asset[] = [];

    /** @internal */
    public constructor(wallet: EthWallet) {
        super();
        this.assets.push(wallet);
        this.addTokenWallets().catch((reason) => console.error(reason));
    }

    public deleteAsset(asset: Asset) {
        const index = this.assets.indexOf(asset);

        if (index >= 0) {
            this.assets.splice(index, 1);
        }
    }

    /** @internal */
    public toJSON() {
        return [ this.assets[0].toJSON() ];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static delay(milliseconds: number) {
        return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
    }

    private static async getKnownTokens() {
        const knownTokens = await QueryCache.fetch(
            "https://raw.githubusercontent.com/kvhnuke/etherwallet/mercury/app/scripts/tokens/ethTokens.json");

        if (Value.isArray(knownTokens)) {
            const result = new Map<string, ITokenInfo>();

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

    private get ethWallet() {
        return this.assets[0] as EthWallet;
    }

    private async addTokenWallets() {
        if (!this.ethWallet.address) {
            return;
        }

        const knownTokens = await EthBundle.getKnownTokens();

        if (!knownTokens) {
            return;
        }

        const currencies = await QueryCache.fetch("https://api.coinmarketcap.com/v2/ticker/");

        if (!Value.hasObjectProperty(currencies, "data")) {
            return;
        }

        const data = currencies.data;

        for (const id in data) {
            if (data.hasOwnProperty(id)) {
                await this.addTokenWallet(knownTokens, this.ethWallet.address, data[id]);
            }
        }
    }

    private async addTokenWallet(
        knownTokens: Map<string, ITokenInfo>, address: string, ticker: Unknown | null | undefined) {
        if (!Value.hasStringProperty(ticker, "symbol") || !Value.hasStringProperty(ticker, "website_slug") ||
            !Value.hasObjectProperty(ticker, "quotes") || !Value.hasObjectProperty(ticker.quotes, "USD")) {
            return;
        }

        const knownToken = knownTokens.get(ticker.symbol);

        if (!knownToken) {
            return;
        }

        const usdQuotes = ticker.quotes.USD;

        if (!Value.hasNumberProperty(usdQuotes, "price")) {
            return;
        }

        const balance = await new EtherscanTokenBalanceRequest(
            address, knownToken.contractAddress, knownToken.decimals).execute();

        if (balance > 0) {
            const newProperties = { ...this.ethWallet as ICryptoWalletProperties, quantity: balance };
            this.assets.push(
                new Erc20TokenWallet(this.ethWallet.parent, newProperties, ticker.symbol, ticker.website_slug));
        }

        // Etherscan will answer at most 5 requests per second. This should push it well below that limit.
        await EthBundle.delay(300);
    }
}
