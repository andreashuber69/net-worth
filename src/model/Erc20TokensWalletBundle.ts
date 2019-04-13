// Copyright (C) 2018-2019 Andreas Huber Dönni
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

import { AssetBundle, ISerializedBundle } from "./AssetBundle";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { Erc20TokenWallet } from "./Erc20TokenWallet";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { Unknown } from "./Unknown";
import { CryptoAuxProperties } from "./validation/schemas/CryptoAuxProperties";
import { Validator } from "./validation/Validator";
import { Value } from "./Value";

interface ISerializedErc20TokensBundle extends ISerializedBundle<ICryptoWalletProperties> {
    deletedAssets: string[];
}

export class Erc20TokensWalletBundle extends AssetBundle {
    public readonly assets: Erc20TokenWallet[] = [];

    public constructor(private readonly erc20Wallet: Erc20TokensWallet, bundle?: Unknown) {
        super();

        try {
            const auxProperties = Validator.validate(CryptoAuxProperties, bundle);
            this.deletedAssets = auxProperties.deletedAssets;
        } catch {
            // Exception intentionally ignored
        }
    }

    public deleteAsset(asset: Erc20TokenWallet) {
        const index = this.assets.indexOf(asset);

        if (index >= 0) {
            this.deletedAssets.push(this.assets[index].unit);
            this.assets.splice(index, 1);
        }
    }

    public async queryData() {
        await this.erc20Wallet.queryData();

        if (!this.erc20Wallet.address) {
            return;
        }

        try {
            const balances = await QueryCache.fetch(
                `https://api.ethplorer.io/getAddressInfo/${this.erc20Wallet.address}?apiKey=dvoio1769GSrYx63`);

            if (!Value.hasArrayProperty(balances, "tokens")) {
                throw new QueryError();
            }

            for (const token of balances.tokens) {
                this.addTokenWallet(token);
            }
        } catch (e) {
            if (e instanceof QueryError) {
                // There's no good place where we can visualize an ERC20 query error in the UI, which is why we just
                // log it in the console.
                console.warn(e);
            } else {
                throw e;
            }
        }
    }

    public toJSON(): ISerializedErc20TokensBundle {
        return {
            primaryAsset: this.erc20Wallet.toJSON(),
            deletedAssets: this.deletedAssets,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly deletedAssetsName = Erc20TokensWalletBundle.getName("deletedAssets");

    private static getName<T extends keyof ISerializedErc20TokensBundle>(name: T) {
        return name;
    }

    private static getPrice(info: Unknown) {
        if (!Value.hasObjectProperty(info, "price") || !Value.hasStringProperty(info.price, "rate") ||
            !Value.hasStringProperty(info.price, "currency") || (info.price.currency !== "USD")) {
            return 0;
        } else {
            return Number.parseFloat(info.price.rate);
        }
    }

    private readonly deletedAssets: string[] = [];

    // The high abc is probably a result of the many conditions paired with short-circuit logic in the second if
    // statement. Breaking this up would not improve readability.
    // codebeat:disable[ABC]
    private addTokenWallet(token: Unknown | null | undefined) {
        if (!Value.hasObjectProperty(token, "tokenInfo")) {
            throw new QueryError();
        }

        const info = token.tokenInfo;

        if (Value.hasStringProperty(info, "symbol") && Value.hasNumberProperty(token, "balance") &&
            (Value.hasNumberProperty(info, "decimals") || Value.hasStringProperty(info, "decimals")) &&
            (this.deletedAssets.indexOf(info.symbol) < 0) && (token.balance > 0)) {
            this.assets.push(new Erc20TokenWallet({
                editable: this.erc20Wallet,
                currencySymbol: info.symbol,
                quantity: token.balance / Math.pow(10, Number.parseFloat(info.decimals.toString())),
                unitValueUsd: Erc20TokensWalletBundle.getPrice(info),
            }));
        }
    }
    // codebeat:enable[ABC]
}
