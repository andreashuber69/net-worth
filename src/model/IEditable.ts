// https://github.com/andreashuber69/net-worth#--
import { IOrdering } from "./Ordering";
import { AssetTypeName } from "./validation/schemas/AssetTypeName.schema";
import { AssetUnion } from "./validation/schemas/AssetUnion.schema";

/** @internal */
export interface IParent {
    readonly assets: {
        readonly ordering: IOrdering;
        readonly grandTotalValue?: number;
    };

    readonly exchangeRate?: number;
}

export interface IEditable {
    readonly type: AssetTypeName | "";
    readonly parent: IParent;
    toJSON(): AssetUnion;
}
