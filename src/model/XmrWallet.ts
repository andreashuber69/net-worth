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
import { RealCryptoWallet } from "./RealCryptoWallet";
import { IQuantityCryptoWallet } from "./validation/schemas/IQuantityCryptoWallet.schema";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";

/** Represents a wallet for Monero. */
export class XmrWallet extends RealCryptoWallet {
    public readonly type = "Monero";

    public constructor(parent: IParent, props: IQuantityCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "XMR"));
    }

    public bundle(bundle?: unknown): GenericAssetBundle<XmrWallet> {
        return new XmrWallet.Bundle(this);
    }

    /** @internal */
    public toJSON(): IQuantityCryptoWallet {
        return {
            type: this.type,
            ...this.getProperties(),
            quantity: this.quantity || 0,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line: max-classes-per-file variable-name
    private static readonly Bundle = class NestedBundle extends GenericAssetBundle<XmrWallet> {
        public toJSON() {
            return {
                primaryAsset: this.assets[0].toJSON(),
            };
        }
    };
}