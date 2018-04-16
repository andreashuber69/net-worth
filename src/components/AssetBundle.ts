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

import { AssetInfo } from "./AssetInfo";

/**
 * Base of all classes that provide information about a bundle of assets.
 * @description This is most commonly used in conjunction with crypto currencies, where one address can hold a balance
 * of multiple currencies. For example, a BTC address could potentially hold balances of BTC, BCH, BTG, BCD and so on.
 */
export class AssetBundle {
    /** Gets the bundled assets. */
    public readonly assets: AssetInfo[];

    /**
     * Creates a new [[AssetBundle]] instance.
     * @param assets The assets to bundle.
     */
    public constructor(...assets: AssetInfo[]) {
        this.assets = assets;
    }
}
