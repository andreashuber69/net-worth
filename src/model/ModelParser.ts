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

import { IParent } from "./IEditable";
import { Model } from "./Model";
import { ObjectConverter } from "./ObjectConverter";
import { AssetBundleUnion } from "./validation/schemas/AssetBundleUnion.schema";
import { IAddressCryptoWallet } from "./validation/schemas/IAddressCryptoWallet.schema";
import { IMiscAsset } from "./validation/schemas/IMiscAsset.schema";
import { IPreciousMetalAsset } from "./validation/schemas/IPreciousMetalAsset.schema";
import { IQuantityCryptoWallet } from "./validation/schemas/IQuantityCryptoWallet.schema";
import { ISimpleCryptoWallet } from "./validation/schemas/ISimpleCryptoWallet.schema";
import { TaggedModel } from "./validation/schemas/TaggedModel.schema";
import { Validator } from "./validation/Validator";

export class ModelParser {
    /**
     * Returns a [[Model]] object that is equivalent to the passed JSON string or returns a string that describes why
     * the parse process failed.
     *
     * @description This is typically called with a string that was returned by [[toJsonString]].
     * @param json The string to parse.
     */
    public static parse(json: string) {
        try {
            return ModelParser.parseBundles(Validator.fromJson(json, TaggedModel));
        } catch (e) {
            if (e instanceof Error) {
                return e.message;
            }

            throw e;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static parseBundles(
        { name, wasSavedToFile, hasUnsavedChanges, currency, groupBy, sort, bundles }: TaggedModel,
    ) {
        const params = {
            name,
            wasSavedToFile,
            hasUnsavedChanges,
            currency,
            groupBy,
            sort,
            createBundles: bundles.map((bundle) => ModelParser.createBundle(bundle)),
        };

        return new Model(params);
    }

    private static createBundle(rawBundle: AssetBundleUnion) {
        return ObjectConverter.convert(rawBundle.primaryAsset, [
            (asset: IPreciousMetalAsset, info) => (
                (parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)
            ),
            (asset: ISimpleCryptoWallet, info) => (
                (parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)
            ),
            (asset: IAddressCryptoWallet, info) => (
                (parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)
            ),
            (asset: IQuantityCryptoWallet, info) => (
                (parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)
            ),
            (asset: IMiscAsset, info) => ((parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)),
        ])[1];
    }
}
