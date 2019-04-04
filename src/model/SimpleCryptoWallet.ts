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
import { GenericAssetBundle } from "./GenericAssetBundle";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { IRealCryptoWalletParameters, RealCryptoWallet } from "./RealCryptoWallet";
import { Unknown } from "./Unknown";

/** Defines the base of all simple crypto currency wallets. */
export abstract class SimpleCryptoWallet extends RealCryptoWallet {
    public bundle(bundle?: Unknown): GenericAssetBundle<this, ICryptoWalletProperties> {
        return new GenericAssetBundle(this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[SimpleCryptoWallet]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param props The crypto wallet properties.
     */
    protected constructor(parent: IModel, props: IRealCryptoWalletParameters) {
        super(parent, props);
    }
}
