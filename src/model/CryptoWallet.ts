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
import { SingleAsset } from "./SingleAsset";
import { Erc20TokensWalletTypeName } from "./validation/schemas/IErc20TokensWallet";
import { SimpleCryptoWalletTypeName } from "./validation/schemas/ISimpleCryptoWallet";
import { QuantityAny } from "./validation/schemas/QuantityAny";

/** Defines the base of all classes that represent a crypto currency wallet. */
export abstract class CryptoWallet extends SingleAsset {
    public abstract get type(): SimpleCryptoWalletTypeName | Erc20TokensWalletTypeName;

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

    public quantity: QuantityAny | undefined;

    public readonly displayDecimals = 6;

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
