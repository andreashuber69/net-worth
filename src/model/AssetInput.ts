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

import { IParent } from "./Asset";
import { ObjectConverter } from "./ObjectConverter";
import { IErc20TokensWallet } from "./validation/schemas/IErc20TokensWallet";
import { IMiscAsset } from "./validation/schemas/IMiscAsset";
import { IPreciousMetalAsset } from "./validation/schemas/IPreciousMetalAsset";
import { ISimpleCryptoWallet } from "./validation/schemas/ISimpleCryptoWallet";
import { AssetBundleUnion } from "./validation/schemas/TaggedAssetBundleUnion";

// tslint:disable-next-line: max-classes-per-file
export class AssetInput {
    /** Provides information objects for each of the supported asset types. */
    public static readonly infos = ObjectConverter.infos;

    /** @internal */
    public static parseBundle(rawBundle: AssetBundleUnion) {
        const [info, result] = AssetInput.parseBundleImpl(rawBundle);
        const validationResult = info.validateAll(rawBundle.primaryAsset);

        return (validationResult === true) ? result : validationResult;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static parseBundleImpl(rawBundle: AssetBundleUnion) {
        return ObjectConverter.convert(rawBundle.primaryAsset, [
            (asset: IPreciousMetalAsset, info) =>
                ((model: IParent) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset: ISimpleCryptoWallet, info) =>
                ((model: IParent) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset: IErc20TokensWallet, info) => ((model: IParent) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset: IMiscAsset, info) => ((model: IParent) => info.createAsset(model, asset).bundle(rawBundle)),
        ]);
    }
}
