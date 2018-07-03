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

import { ICryptoWallet, ICryptoWalletProperties } from "./CryptoWallet";
import { IPreciousMetalAsset, IPreciousMetalAssetProperties } from "./PreciousMetalAsset";

/** Combines the defining properties of all assets. */
export type IAllAssetProperties = ICryptoWalletProperties & IPreciousMetalAssetProperties;

export type AllAssetPropertyNames = keyof IAllAssetProperties;

/** @internal */
export type IAssetUnion = ICryptoWallet | IPreciousMetalAsset;

/** @internal */
export interface ISerializedObject {
    readonly type: string;
}

/** @internal */
export type ISerializedAsset = ISerializedObject & (ICryptoWalletProperties | IPreciousMetalAssetProperties);
