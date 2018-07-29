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

import { Asset, IModel } from "./Asset";
import { AssetType } from "./AssetTypes";
import { cryptoWalletSuperType, ICryptoWallet } from "./ICryptoWallet";

/** Defines the base of all classes that represent a crypto currency wallet. */
export abstract class CryptoWallet extends Asset implements ICryptoWallet {
    /** @internal */
    public static readonly superType = cryptoWalletSuperType;

    public abstract get type(): keyof typeof AssetType;

    public get locationHint() {
        return this.address;
    }

    public abstract get address(): string;

    public get unit() {
        return this.currencySymbol;
    }

    public get fineness() {
        return undefined;
    }

    public quantity: number | undefined;

    public readonly displayDecimals = 6;

    /** @internal */
    public readonly superType = CryptoWallet.superType;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[CryptoWallet]] instance.
     * @param parent The parent model to which this asset belongs.
     * @param currencySymbol The crypto currency symbol, e.g. 'BTC', 'LTC'.
     */
    protected constructor(parent: IModel, private readonly currencySymbol: string) {
        super(parent);
    }
}
