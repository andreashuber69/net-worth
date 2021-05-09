// https://github.com/andreashuber69/net-worth#--
import type { IDeletedAssets } from "./IDeletedAssets.schema";

export class DeletedAssets implements IDeletedAssets {
    readonly [key: string]: unknown;

    public readonly deletedAssets!: readonly string[];
}
