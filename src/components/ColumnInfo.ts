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

import { AssetDisplayPropertyName } from "../model/Asset";
import { GroupBys } from "../model/Ordering";

export type ColumnName = "expand" | AssetDisplayPropertyName | "more";

export class ColumnInfo {
    /**
     * This is the number of columns that are always visible. If no optional columns are currently shown (i.e.
     * optionalCount = 0), the first 4 columns of whatever is returned by `getAllNames` will be shown.
     */
    public static readonly requiredCount = 4;

    /** Provides the maximum number of optional columns that can be displayed. */
    public static readonly maxOptionalCount = 7;

    /** @internal */
    public static getTotalCount(optionalCount: number) {
        return ColumnInfo.requiredCount + optionalCount;
    }

    public static getAllNames(groupBys: GroupBys): readonly ColumnName[] {
        return [
            "expand", groupBys[0], "percent", "more", "totalValue", groupBys[1], "unit",
            "quantity", "unitValue", "description", "fineness",
        ] as const;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
