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

import { IParent } from "./Asset";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { IRealCryptoWalletParameters, RealCryptoWallet } from "./RealCryptoWallet";
import { Unknown } from "./Unknown";
import { ISimpleCryptoWallet, SimpleCryptoWalletTypeName } from "./validation/schemas/ISimpleCryptoWallet";

/** Defines the base of all simple crypto currency wallets. */
export abstract class SimpleCryptoWallet extends RealCryptoWallet implements ISimpleCryptoWallet {
    public abstract get type(): SimpleCryptoWalletTypeName;

    public bundle(bundle?: Unknown): GenericAssetBundle<SimpleCryptoWallet> {
        return new SimpleCryptoWallet.Bundle(this);
    }

    /** @internal */
    public toJSON(): ISimpleCryptoWallet {
        return {
            type: this.type,
            ...this.getProperties(),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[SimpleCryptoWallet]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param props The crypto wallet properties.
     */
    protected constructor(parent: IParent, props: IRealCryptoWalletParameters) {
        super(parent, props);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line: max-classes-per-file variable-name
    private static readonly Bundle = class NestedBundle extends GenericAssetBundle<SimpleCryptoWallet> {
        public toJSON() {
            return {
                primaryAsset: this.assets[0],
            };
        }
    };
}
