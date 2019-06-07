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

import { ICryptoWalletProperties } from "../../ICryptoWalletProperties";

export const simpleCryptoWalletTypeNames = [
    "Bitcoin", "Litecoin", "Ethereum Classic", "Ethereum", "Bitcoin Gold", "Dash", "Zcash",
] as const;

export type SimpleCryptoWalletTypeName = (typeof simpleCryptoWalletTypeNames)[number];

export interface ISimpleCryptoObject {
    readonly type: SimpleCryptoWalletTypeName;
}

export interface ISimpleCryptoWallet extends ISimpleCryptoObject, ICryptoWalletProperties {
}
