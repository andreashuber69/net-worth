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

import { AssetBundle } from "./AssetBundle";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { Erc20TokenWallet } from "./Erc20TokenWallet";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { DeletedAssets } from "./validation/schemas/DeletedAssets.schema";
import { EthplorerGetAddressInfoResponse, IToken } from "./validation/schemas/EthplorerGetAddressInfoResponse.schema";
import { IErc20TokensWalletBundle } from "./validation/schemas/IErc20TokensWalletBundle.schema";
import { Validator } from "./validation/Validator";

export class Erc20TokensWalletBundle extends AssetBundle {
    public readonly assets = new Array<Erc20TokenWallet>();

    public constructor(private readonly erc20Wallet: Erc20TokensWallet, bundle?: unknown) {
        super();

        try {
            this.deletedAssets = [...Validator.fromData(bundle, DeletedAssets).deletedAssets];
        } catch {
            this.deletedAssets = [];
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
            const url = `https://api.ethplorer.io/getAddressInfo/${this.erc20Wallet.address}?apiKey=dvoio1769GSrYx63`;
            const balances = await QueryCache.fetch(url, EthplorerGetAddressInfoResponse);

            for (const token of balances.tokens || [Erc20TokensWalletBundle.noTokenBalance]) {
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

    public toJSON(): IErc20TokensWalletBundle {
        return {
            primaryAsset: this.erc20Wallet.toJSON(),
            deletedAssets: this.deletedAssets,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static get noTokenBalance(): IToken {
        return {
            balance: 1e-10,
            tokenInfo: {
                decimals: 0,
                price: false,
                symbol: "No Token Balance Found!",
            },
        };
    }

    private readonly deletedAssets: string[];

    private addTokenWallet(token: IToken) {
        const info = token.tokenInfo;

        if ((this.deletedAssets.indexOf(info.symbol) < 0) && (token.balance > 0)) {
            this.assets.push(new Erc20TokenWallet({
                editable: this.erc20Wallet,
                currencySymbol: info.symbol,
                quantity: token.balance / Math.pow(10, Number.parseFloat(info.decimals.toString())),
                unitValueUsd: info.price && info.price.rate || 0,
            }));
        }
    }
}
