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

import { arrayOfAll } from "./arrayOfAll";
import { AssetTypeName } from "./validation/schemas/AssetTypeName.schema";
import { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";
import { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

/** Combines the defining properties of all assets. */
export type IAssetPropertiesIntersection =
    IPreciousMetalAssetProperties & ISimpleCryptoWalletProperties &
    IAddressCryptoWalletProperties & IQuantityCryptoWalletProperties & IMiscAssetProperties;

export type IAssetIntersection = IAssetPropertiesIntersection & {
    readonly type: AssetTypeName;
};

export type AssetPropertyName = keyof IAssetPropertiesIntersection;

export const allAssetPropertyNames = arrayOfAll<AssetPropertyName>()(
    "description",
    "location",
    "quantity",
    "notes",
    "weight",
    "weightUnit",
    "fineness",
    "address",
    "value",
    "valueCurrency",
);
