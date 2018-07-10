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
import { ltcWalletType } from "./AssetTypes";
import { CryptoWallet } from "./CryptoWallet";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { Unknown, Value } from "./Value";

/** Represents a LTC wallet. */
export class LtcWallet extends CryptoWallet {
    public static readonly type = ltcWalletType;

    public readonly type = LtcWallet.type;

    /** Creates a new [[LtcWallet]] instance.
     * @description If a non-empty string is passed for [[ICryptoWalletProperties.address]], then an attempt is made to
     * retrieve the wallet balance, which is then added to whatever is passed for [[ICryptoWalletProperties.quantity]].
     * It therefore usually only makes sense to specify either address or quantity, not both.
     * @param parent The parent model to which this asset belongs.
     * @param properties The crypto wallet properties.
     */
    public constructor(parent: IModel, properties: ICryptoWalletProperties) {
        super(parent, properties, "LTC", "litecoin");
    }

    public bundle(bundle?: Unknown): AssetBundle {
        return new GenericAssetBundle(this);
    }

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();

        if (this.address) {
            this.quantity = (this.quantity === undefined ? 0 : this.quantity) +
                await new LtcWallet.BlockcypherRequest(this.address).execute();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:variable-name max-classes-per-file
    private static readonly BlockcypherRequest = class NestedBlockcypherRequest implements IWebRequest<number> {
        public constructor(private readonly address: string) {
        }

        public async execute() {
            return NestedBlockcypherRequest.getBalance(
                await QueryCache.fetch(`https://api.blockcypher.com/v1/ltc/main/addrs/${this.address}/balance`));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static getBalance(response: Unknown | null) {
            if (Value.hasNumberProperty(response, "balance")) {
                return response.balance / 1E8;
            }

            return Number.NaN;
        }
    };
}
