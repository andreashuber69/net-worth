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

import { Asset } from "./Asset";

/**
 * Defines the base of all classes that represent a bundle of assets.
 * @description This is most commonly used in conjunction with crypto currencies, where one address can hold a balance
 * of multiple currencies. For example, a BTC address could potentially hold balances of BTC, BCH, BTG, BCD and so on.
 */
export class AssetBundle {
    /** Provides the bundled assets. */
    public readonly assets: Asset[];

    /**
     * Creates a new [[AssetBundle]] instance.
     * @param assets The assets to bundle.
     */
    public constructor(...assets: Asset[]) {
        this.assets = assets;
    }

    /** Deletes `asset` from [[assets]]. */
    public deleteAsset(asset: Asset) {
        const index = this.assets.indexOf(asset);

        if (index >= 0) {
            this.assets.splice(index, 1);
        }
    }

    /** @internal */
    public toJSON() {
        return this.assets.map((asset) => asset.toJSON());
    }
}
