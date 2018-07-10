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

export const btcWalletType = "Bitcoin";
export const ltcWalletType = "Litecoin";
export const dashWalletType = "Dash";
export const etcWalletType = "Ethereum Classic";
export const ethWalletType = "Ethereum";
export const erc20TokenWalletType = "ERC20 Token";
export const zecWalletType = "Zcash";
export const silverAssetType = "Silver";
export const goldAssetType = "Gold";

export type EditableCryptoWalletType =
    typeof btcWalletType | typeof ltcWalletType | typeof dashWalletType |
    typeof etcWalletType | typeof ethWalletType | typeof zecWalletType;
type CryptoWalletType = EditableCryptoWalletType | typeof erc20TokenWalletType;

export type EditablePreciousMetalAssetType = typeof silverAssetType | typeof goldAssetType;
type PreciousMetalAssetType = EditablePreciousMetalAssetType;

export type EditableAssetType = EditableCryptoWalletType | EditablePreciousMetalAssetType;
export type AssetType = CryptoWalletType | PreciousMetalAssetType;
