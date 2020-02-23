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
import { IParent } from "./Asset";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { monero } from "./validation/schemas/AssetTypeName.schema";
import { IQuantityCryptoWallet } from "./validation/schemas/IQuantityCryptoWallet.schema";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";

/** Represents a wallet for Monero. */
export class XmrWallet extends RealCryptoWallet {
    public static readonly type = monero;

    public readonly type = monero;

    public constructor(parent: IParent, props: IQuantityCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "XMR"));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public bundle(bundle?: unknown): GenericAssetBundle<XmrWallet> {
        return new XmrWallet.Bundle(this);
    }

    /** @internal */
    public toJSON(): IQuantityCryptoWallet {
        return {
            type: this.type,
            ...this.getProperties(),
            quantity: this.quantity ?? 0,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly Bundle = class NestedBundle extends GenericAssetBundle<XmrWallet> {
        public toJSON() {
            return {
                primaryAsset: this.assets[0].toJSON(),
            };
        }
    };
}
