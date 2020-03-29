// https://github.com/andreashuber69/net-worth#--
import { AssetPropertyName } from "./AssetInterfaces";

export type CompositeInput = { [K in AssetPropertyName]?: unknown };
export type Input = CompositeInput | unknown;

export class InputUtility {
    public static isComposite(input: Input): input is CompositeInput {
        return input instanceof Object;
    }
}
