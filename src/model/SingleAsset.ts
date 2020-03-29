// https://github.com/andreashuber69/net-worth#--
import { Asset } from "./Asset";
import { IParent } from "./IEditable";

/** Defines the base of all classes that represent a single asset (as opposed to an [[AssetGroup]]). */
export abstract class SingleAsset extends Asset {
    public quantityHint = "";

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(parent: IParent) {
        super(parent);
    }
}
