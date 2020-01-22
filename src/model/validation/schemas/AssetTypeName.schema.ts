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

export const silver = "Silver";
export const palladium = "Palladium";
export const platinum = "Platinum";
export const gold = "Gold";
export const bitcoin = "Bitcoin";
export const monero = "Monero";
export const litecoin = "Litecoin";
export const ethereumClassic = "Ethereum Classic";
export const ethereum = "Ethereum";
export const erc20Tokens = "ERC20 Tokens";
export const bitcoinGold = "Bitcoin Gold";
export const dash = "Dash";
export const zcash = "Zcash";
export const misc = "Misc";

export const assetTypeNames = [
    silver,
    palladium,
    platinum,
    gold,
    bitcoin,
    monero,
    litecoin,
    ethereumClassic,
    ethereum,
    erc20Tokens,
    bitcoinGold,
    dash,
    zcash,
    misc,
] as const;

export type AssetTypeName = typeof assetTypeNames[number];
