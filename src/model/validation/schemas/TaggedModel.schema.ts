// https://github.com/andreashuber69/net-worth#--
import type { AssetBundleUnion } from "./AssetBundleUnion.schema";
import type { CurrencyName } from "./CurrencyName.schema";
import type { GroupBy } from "./GroupBy.schema";
import type { ISort } from "./ISort.schema";

export class TaggedModel {
    public readonly version!: 1;
    public readonly name?: string;
    public readonly wasSavedToFile?: boolean;
    public readonly hasUnsavedChanges?: boolean;
    public readonly currency?: CurrencyName;
    public readonly groupBy?: GroupBy;
    public readonly sort?: ISort;
    public readonly bundles!: readonly AssetBundleUnion[];
}
