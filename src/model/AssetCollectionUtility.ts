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

import { Asset } from "./Asset";
import { AssetGroup } from "./AssetGroup";
import { ISort } from "./validation/schemas/ISort.schema";
import { SortBy } from "./validation/schemas/SortBy.schema";

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
