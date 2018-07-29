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
import { GenericAssetBundle } from "./GenericAssetBundle";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { Unknown, Value } from "./Value";

/** Represents a ZEC wallet. */
export class ZecWallet extends RealCryptoWallet {
    public readonly type = "Zcash";

    public constructor(parent: IModel, properties: ICryptoWalletProperties) {
        super(parent, properties, "ZEC", "zcash");
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();

        if (this.address) {
            this.quantity = (this.quantity === undefined ? 0 : this.quantity) +
                await new ZecWallet.SoChainRequest(this.address).execute();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:max-classes-per-file variable-name
    private static readonly SoChainRequest = class NestedSoChainRequest implements IWebRequest<number> {
        public constructor(private readonly address: string) {
        }

        public async execute() {
            return NestedSoChainRequest.getBalance(
                await QueryCache.fetch(`https://chain.so/api/v2/get_address_balance/ZEC/${this.address}`));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static getBalance(response: Unknown | null) {
            if (Value.hasStringProperty(response, "status") && (response.status === "success") &&
                Value.hasObjectProperty(response, "data") &&
                Value.hasStringProperty(response.data, "confirmed_balance")) {
                return Number.parseFloat(response.data.confirmed_balance);
            }

            return Number.NaN;
        }
    };
}
