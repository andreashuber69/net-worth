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

import { IModel } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { AssetType } from "./AssetTypes";
import { CryptoWallet } from "./CryptoWallet";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { Unknown, Value } from "./Value";

/** Represents an ETC wallet. */
export class EtcWallet extends CryptoWallet {
    public static readonly type = AssetType.Etc;

    public readonly type = EtcWallet.type;

    public constructor(parent: IModel, properties: ICryptoWalletProperties) {
        super(parent, properties, "ETC", "ethereum-classic");
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();

        if (this.address) {
            this.quantity = (this.quantity === undefined ? 0 : this.quantity) +
                await new EtcWallet.GastrackerRequest(this.address).execute();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:max-classes-per-file variable-name
    private static readonly GastrackerRequest = class NestedGastrackerRequest implements IWebRequest<number> {
        public constructor(private readonly address: string) {
        }

        public async execute() {
            return NestedGastrackerRequest.getBalance(
                await QueryCache.fetch(`https://api.gastracker.io/addr/${this.address}`));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static getBalance(response: Unknown | null) {
            if (Value.hasObjectProperty(response, "balance") &&
                Value.hasNumberProperty(response.balance, "ether")) {
                return response.balance.ether;
            }

            return Number.NaN;
        }
    };
}
