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

/** Represents a BTG wallet. */
export class BtgWallet extends CryptoWallet {
    public readonly type = AssetType.Btg;

    public constructor(parent: IModel, properties: ICryptoWalletProperties) {
        super(parent, properties, "BTG", "bitcoin-gold");
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();

        if (this.address) {
            this.quantity = (this.quantity === undefined ? 0 : this.quantity) +
                await new BtgWallet.BtgexpRequest(this.address).execute();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:max-classes-per-file variable-name
    private static readonly BtgexpRequest = class NestedBtgexpRequest implements IWebRequest<number> {
        public constructor(private readonly address: string) {
        }

        public async execute() {
            return NestedBtgexpRequest.getBalance(
                await QueryCache.fetch(`https://btgexp.com/ext/getbalance/${this.address}`));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static getBalance(response: Unknown | null) {
            if (Value.isNumber(response)) {
                return response;
            }

            return Number.NaN;
        }
    };
}
