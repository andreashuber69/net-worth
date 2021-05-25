// https://github.com/andreashuber69/net-worth#--
import type { Asset } from "./Asset";
import type { AssetGroup } from "./AssetGroup";
import type { ISort } from "./validation/schemas/ISort.schema";
import type { SortBy } from "./validation/schemas/SortBy.schema";

export class AssetCollectionUtility {
    public static sort(groups: AssetGroup[], sort: ISort) {
        groups.sort((l, r) => AssetCollectionUtility.compare(l, r, sort));

        for (const group of groups) {
            group.assets.sort((l, r) => AssetCollectionUtility.compare(l, r, sort));
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static compare(left: Asset, right: Asset, sort: ISort) {
        return (sort.descending ? -1 : 1) * AssetCollectionUtility.compareImpl(left, right, sort.by);
    }

    private static compareImpl(left: Asset, right: Asset, sortBy: SortBy) {
        const leftProperty = left[sortBy];
        const rightProperty = right[sortBy];

        if (leftProperty === rightProperty) {
            return 0;
        } else if (leftProperty === undefined) {
            return -1;
        } else if (rightProperty === undefined) {
            return 1;
        } else if (leftProperty < rightProperty) {
            return -1;
        }

        return 1;
    }
}
