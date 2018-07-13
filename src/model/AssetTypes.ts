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

export const silverAssetType = "Silver";
export const palladiumAssetType = "Palladium";
export const platinumAssetType = "Platinum";
export const goldAssetType = "Gold";

export const btcWalletType = "Bitcoin";
export const ltcWalletType = "Litecoin";
export const etcWalletType = "Ethereum Classic";
export const ethWalletType = "Ethereum";
export const erc20TokenWalletType = "ERC20 Token";
export const btgWalletType = "Bitcoin Gold";
export const dashWalletType = "Dash";
export const zecWalletType = "Zcash";

export type EditablePreciousMetalAssetType =
    typeof silverAssetType | typeof palladiumAssetType | typeof platinumAssetType | typeof goldAssetType;
type PreciousMetalAssetType = EditablePreciousMetalAssetType;

export type EditableCryptoWalletType =
    typeof btcWalletType | typeof ltcWalletType | typeof etcWalletType |
    typeof ethWalletType | typeof btgWalletType | typeof dashWalletType | typeof zecWalletType;
type CryptoWalletType = EditableCryptoWalletType | typeof erc20TokenWalletType;

export type EditableAssetType = EditableCryptoWalletType | EditablePreciousMetalAssetType;
export type AssetType = CryptoWalletType | PreciousMetalAssetType;
