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

import { IAssetProperties } from "./IAssetProperties.schema";
import { QuantityAny } from "./QuantityAny.schema";

export interface ICryptoWalletAddressProperties extends IAssetProperties {
    /** Provides the public address. */
    readonly address: string;
}

export interface ICryptoWalletQuantityProperties extends IAssetProperties {
    /** Provides the asset quantity. */
    readonly quantity: QuantityAny;
}

/** Contains the defining properties common to all simple crypto currency wallets. */
export type ISimpleCryptoWalletProperties = ICryptoWalletAddressProperties | ICryptoWalletQuantityProperties;
