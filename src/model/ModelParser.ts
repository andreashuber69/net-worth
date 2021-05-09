// https://github.com/andreashuber69/net-worth#--
import type { IParent } from "./IEditable";
import { Model } from "./Model";
import { ObjectConverter } from "./ObjectConverter";
import type { AssetBundleUnion } from "./validation/schemas/AssetBundleUnion.schema";
import type { IAddressCryptoWallet } from "./validation/schemas/IAddressCryptoWallet.schema";
import type { IMiscAsset } from "./validation/schemas/IMiscAsset.schema";
import type { IPreciousMetalAsset } from "./validation/schemas/IPreciousMetalAsset.schema";
import type { IQuantityCryptoWallet } from "./validation/schemas/IQuantityCryptoWallet.schema";
import type { ISimpleCryptoWallet } from "./validation/schemas/ISimpleCryptoWallet.schema";
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
