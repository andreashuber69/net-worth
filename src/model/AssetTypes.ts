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

import { BtcWallet } from "./BtcWallet";
import { EthWallet } from "./EthWallet";
import { GoldAsset } from "./GoldAsset";
import { SilverAsset } from "./SilverAsset";

export type CryptoWalletTypes = typeof BtcWallet.type | typeof EthWallet.type;
export type PreciousMetalAssetTypes = typeof SilverAsset.type | typeof GoldAsset.type;
export type AssetTypes = CryptoWalletTypes | PreciousMetalAssetTypes;
