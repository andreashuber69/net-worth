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
import { AssetBundle } from "./AssetBundle";
import { IModelParameters, Model } from "./Model";
import { ObjectConverter } from "./ObjectConverter";
import { IErc20TokensWallet } from "./validation/schemas/IErc20TokensWallet";
import { IMiscAsset } from "./validation/schemas/IMiscAsset";
import { IPreciousMetalAsset } from "./validation/schemas/IPreciousMetalAsset";
import { ISimpleCryptoWallet } from "./validation/schemas/ISimpleCryptoWallet";
import { AssetBundleUnion } from "./validation/schemas/TaggedAssetBundleUnion";
import { TaggedModel } from "./validation/schemas/TaggedModel";
import { Validator } from "./validation/Validator";

export class ModelParser {
    /**
     * Returns a [[Model]] object that is equivalent to the passed JSON string or returns a string that describes why
     * the parse process failed.
     * @description This is typically called with a string that was returned by [[toJsonString]].
     * @param json The string to parse
     */
    public static parse(json: string) {
        try {
            return ModelParser.parseBundles(Validator.fromJson(json, TaggedModel));
        } catch (e) {
            if (e instanceof Error) {
                return e.message;
            } else {
                throw e;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static parseBundles(rawModel: TaggedModel) {
        const params: IModelParameters = {
            ...ModelParser.parseOptionalProperties(rawModel),
            ...ModelParser.parseOptionalViewProperties(rawModel),
            createBundles: new Array<(parent: IParent) => AssetBundle>(),
        };

        for (const rawBundle of rawModel.bundles) {
            const createBundle = ModelParser.parseAndValidateBundle(rawBundle);

            if (!(createBundle instanceof Function)) {
                return createBundle;
            }

            params.createBundles.push(createBundle);
        }

        return new Model(params);
    }

    private static parseOptionalProperties(rawModel: TaggedModel) {
        return (({ name, wasSavedToFile, hasUnsavedChanges }) =>
            ({ name, wasSavedToFile, hasUnsavedChanges }))(rawModel);
    }

    private static parseOptionalViewProperties(rawModel: TaggedModel) {
        return (({ currency, groupBy, sort }) => ({ currency, groupBy, sort }))(rawModel);
    }

    private static parseAndValidateBundle(rawBundle: AssetBundleUnion) {
        const [info, result] = ModelParser.parseBundle(rawBundle);
        const validationResult = info.validateAll(rawBundle.primaryAsset);

        return (validationResult === true) ? result : validationResult;
    }

    private static parseBundle(rawBundle: AssetBundleUnion) {
        return ObjectConverter.convert(rawBundle.primaryAsset, [
            (asset: IPreciousMetalAsset, info) =>
                ((parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)),
            (asset: ISimpleCryptoWallet, info) =>
                ((parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)),
            (asset: IErc20TokensWallet, info) =>
                ((parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)),
            (asset: IMiscAsset, info) => ((parent: IParent) => info.createAsset(parent, asset).bundle(rawBundle)),
        ]);
    }
}
