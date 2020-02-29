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

/* eslint-disable max-classes-per-file */
import { IAssetBundle } from "./Asset";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { IParent } from "./IEditable";
import { IRealCryptoWalletParameters, RealCryptoWallet } from "./RealCryptoWallet";
import { ISimpleCryptoWallet, SimpleCryptoWalletTypeName } from "./validation/schemas/ISimpleCryptoWallet.schema";

/** Defines the base of all simple crypto currency wallets. */
export abstract class SimpleCryptoWallet extends RealCryptoWallet {
    public abstract get type(): SimpleCryptoWalletTypeName;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public bundle(bundle?: unknown): IAssetBundle {
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

    protected constructor(parent: IParent, props: IRealCryptoWalletParameters) {
        super(parent, props);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly Bundle = class extends GenericAssetBundle<SimpleCryptoWallet> implements IAssetBundle {
        public toJSON() {
            return {
                primaryAsset: this.assets[0].toJSON(),
            };
        }
    };
}
