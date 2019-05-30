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

import { IModel } from "./Asset";
import { TaggedObjectConverter } from "./TaggedObjectConverter";
import { ITaggedErc20TokensWallet } from "./validation/schemas/ITaggedErc20TokensWallet";
import { ITaggedMiscAsset } from "./validation/schemas/ITaggedMiscAsset";
import { ITaggedPreciousMetalAsset } from "./validation/schemas/ITaggedPreciousMetalAsset";
import { ITaggedSimpleCryptoWallet } from "./validation/schemas/ITaggedSimpleCryptoWallet";
import { TaggedAssetBundleUnion } from "./validation/schemas/TaggedAssetBundleUnion";

// tslint:disable-next-line: max-classes-per-file
export class AssetInput {
    /** Provides information objects for each of the supported asset types. */
    public static readonly infos = TaggedObjectConverter.infos;

    /** @internal */
    public static parseBundle(rawBundle: TaggedAssetBundleUnion) {
        const [info, result] = AssetInput.parseBundleImpl(rawBundle);
        const validationResult = info.validateAll(rawBundle.primaryAsset);

        return (validationResult === true) ? result : validationResult;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static parseBundleImpl(rawBundle: TaggedAssetBundleUnion) {
        return TaggedObjectConverter.convert(rawBundle.primaryAsset, [
            (asset: ITaggedPreciousMetalAsset, info) =>
                ((model: IModel) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset: ITaggedSimpleCryptoWallet, info) =>
                ((model: IModel) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset: ITaggedErc20TokensWallet, info) =>
                ((model: IModel) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset: ITaggedMiscAsset, info) => ((model: IModel) => info.createAsset(model, asset).bundle(rawBundle)),
        ]);
    }
}
