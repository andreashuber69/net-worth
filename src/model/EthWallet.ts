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
import { CryptoWallet, ICryptoWalletProperties } from "./CryptoWallet";
import { Erc20TokenWallet } from "./Erc20TokenWallet";
import { EtherscanEthBalanceRequest } from "./EtherscanEthBalanceRequest";
import { EtherscanTokenBalanceRequest } from "./EtherscanTokenBalanceRequest";
import { QueryCache } from "./QueryCache";
import { Unknown, Value } from "./Value";

interface ITokenInfo {
    readonly contractAddress: string;
    readonly decimals: number;
}

/** Represents an ETH wallet. */
export class EthWallet extends CryptoWallet {
    public static readonly type = "Ethereum";

    public readonly type = EthWallet.type;

    /** Creates a new [[EthWallet]] instance.
     * @description If a non-empty string is passed for [[ICryptoProperties.address]], then an attempt is made to
     * retrieve the wallet balance, which is then added to whatever is passed for [[ICryptoProperties.quantity]]. It
     * therefore usually only makes sense to specify either address or quantity, not both.
     * @param parent The parent model to which this asset belongs.
     * @param properties The crypto wallet properties.
     */
    public constructor(parent: IModel, properties: ICryptoWalletProperties) {
        super(parent, properties, "ETH", "ethereum");
        this.queryQuantity().catch((reason) => console.error(reason));
    }

    public bundle(): AssetBundle {
        return new EthWallet.EthBundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:max-classes-per-file variable-name
    private static readonly EthBundle = class NestedEthBundle extends AssetBundle {
        public readonly assets: Asset[] = [];

        /** @internal */
        public constructor(private readonly ethWallet: EthWallet) {
            super();
            this.assets.push(ethWallet);
            this.addTokenWallets().catch((reason) => console.error(reason));
        }

        public deleteAsset(asset: Asset) {
            const index = this.assets.indexOf(asset);

            if (index >= 0) {
                this.assets.splice(index, index === 0 ? this.assets.length : 1);
            }
        }

        /** @internal */
        public toJSON() {
            return [ this.ethWallet.toJSON() ];
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        private async addTokenWallets() {
            if (!this.ethWallet.address) {
                return;
            }

            const knownTokens = await NestedEthBundle.getKnownTokens();

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
            await NestedEthBundle.delay(300);
        }
    };

    private async queryQuantity() {
        if (this.address) {
            this.quantity = (this.quantity === undefined ? 0 : this.quantity) +
                await new EtherscanEthBalanceRequest(this.address).execute();
        }
    }
}
