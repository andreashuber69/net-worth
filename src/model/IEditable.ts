// https://github.com/andreashuber69/net-worth#--
import type { IOrdering } from "./Ordering";
import type { AssetTypeName } from "./validation/schemas/AssetTypeName.schema";
import type { AssetUnion } from "./validation/schemas/AssetUnion.schema";

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
