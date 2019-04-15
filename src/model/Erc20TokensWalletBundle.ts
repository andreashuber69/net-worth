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
import { Query } from "./Query";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { Unknown } from "./Unknown";
import { CryptoAuxProperties } from "./validation/schemas/CryptoAuxProperties";
import { GetAddressInfoResponse, IToken } from "./validation/schemas/GetAddressInfoResponse";
import { Validator } from "./validation/Validator";

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
            const balances =
                await QueryCache.fetch(new Erc20TokensWalletBundle.GetAddressInfoQuery(this.erc20Wallet.address));

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line: max-classes-per-file variable-name
    private static readonly GetAddressInfoQuery = class NestedQuery extends Query<GetAddressInfoResponse> {
        public constructor(address: string) {
            super(`https://api.ethplorer.io/getAddressInfo/${address}?apiKey=dvoio1769GSrYx63`, GetAddressInfoResponse);
        }
    };

    private readonly deletedAssets: string[] = [];

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
