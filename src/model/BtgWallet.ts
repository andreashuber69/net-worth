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

import { IModel } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { Unknown } from "./Unknown";
import { Value } from "./Value";

/** Represents a BTG wallet. */
export class BtgWallet extends RealCryptoWallet {
    public readonly type = "Bitcoin Gold";

    public constructor(parent: IModel, props: ICryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "BTG", "bitcoin-gold"));
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected queryQuantity() {
        return new BtgWallet.BtgexpRequest(this.address).execute();
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

            throw new QueryError();
        }
    };
}
