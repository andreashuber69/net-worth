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

/** Enumerates the possible asset types. */
export enum AssetType {
    "Silver",
    "Palladium",
    "Platinum",
    "Gold",
    "Bitcoin",
    "Litecoin",
    "Ethereum Classic",
    "Ethereum",
    "ERC20 Tokens",
    "Bitcoin Gold",
    "Dash",
    "Zcash",
    "Misc",
}

export type PreciousMetalAssetType = "Silver" | "Palladium" | "Platinum" | "Gold";

export type CryptoWalletType =
    "Bitcoin" | "Litecoin" | "Ethereum Classic" | "Ethereum" | "ERC20 Tokens" | "Bitcoin Gold" | "Dash" | "Zcash";
