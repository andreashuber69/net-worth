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

import { AssetBundle } from "./AssetBundle";
import { IAssetProperties } from "./IAssetProperties";
import { ISerializedAsset } from "./ISerializedAsset";
import { ISerializedBundle } from "./ISerializedBundle";
import { SingleAsset } from "./SingleAsset";

/** Defines a bundle containing a single asset. */
export class GenericAssetBundle<
    T extends SingleAsset & ISerializedAsset<T["type"], U>, U extends IAssetProperties> extends AssetBundle {
    public readonly assets: T[];

    /** @internal */
    public constructor(asset: T) {
        super();
        this.assets = [ asset ];
    }

    public deleteAsset(asset: T) {
        const index = this.assets.indexOf(asset);

        if (index >= 0) {
            this.assets.splice(index, 1);
        }
    }

    public queryData() {
        return this.assets[0].queryData();
    }

    public toJSON(): ISerializedBundle<ISerializedAsset<T["type"], U>> {
        return {
            primaryAsset: this.assets[0],
        };
    }
}
