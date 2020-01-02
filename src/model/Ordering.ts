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

import { arrayOfAll } from "./arrayOfAll";
import { GroupBy } from "./validation/schemas/GroupBy.schema";
import { ISort } from "./validation/schemas/ISort.schema";

interface IOrderingParameters {
    // tslint:disable-next-line:prefer-method-signature
    readonly onGroupChanged: () => void;
    // tslint:disable-next-line:prefer-method-signature
    readonly onSortChanged: () => void;
    readonly groupBy?: GroupBy;
    readonly sort?: ISort;
}

const allGroupBys = [
    arrayOfAll<GroupBy>()("type", "location"),
    arrayOfAll<GroupBy>()("location", "type"),
] as const;

export type GroupBys = typeof allGroupBys[number];

export interface IOrdering {
    readonly groupBys: GroupBys;
}

/** Provides information how assets are ordered (grouped and sorted) in the main model of the application. */
export class Ordering implements IOrdering {
    /** Provides the labels for the properties by which the asset list can be grouped. */
    public get defaultGroupByLabels() {
        return Ordering.capitalizeGroupBys(allGroupBys[0]);
    }

    /** Provides the names of the properties by which the asset list is currently grouped. */
    public get groupBys() {
        return allGroupBys[this.groupByIndex];
    }

    /** Provides the labels for the properties by which the asset list is currently grouped. */
    public get groupByLabels() {
        return Ordering.capitalizeGroupBys(this.groupBys);
    }

    /** Provides information on how to sort the asset list. */
    public get sort() {
        return this.sortImpl;
    }

    public set sort(sort: ISort) {
        this.sortImpl = sort;
        this.onSortChanged();
    }

    public constructor(params: IOrderingParameters) {
        ({ onGroupChanged: this.onGroupChanged, onSortChanged: this.onSortChanged } = params);
        this.groupByIndex = params.groupBy && Ordering.getIndex(params.groupBy) || 0;
        this.sortImpl = params.sort || { by: "totalValue", descending: true };
    }

    public setGroupBy(groupBy: GroupBy) {
        this.groupByIndex = Ordering.getIndex(groupBy);
        this.onGroupChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getIndex(groupBy: GroupBy) {
        const result = allGroupBys.findIndex((groupBys) => groupBys[0] === groupBy);

        if (result < 0) {
            throw new Error(`Unknown groupBy: ${groupBy}`);
        }

        return result;
    }

    private static capitalizeGroupBys(groupBys: Readonly<GroupBys>) {
        return [Ordering.capitalizeGroupBy(groupBys[0]), Ordering.capitalizeGroupBy(groupBys[1])] as const;
    }

    private static capitalizeGroupBy(groupBy: GroupBy) {
        return `${groupBy[0].toUpperCase()}${groupBy.substr(1)}`;
    }

    // tslint:disable-next-line:prefer-method-signature
    private readonly onGroupChanged: () => void;
    // tslint:disable-next-line:prefer-method-signature
    private readonly onSortChanged: () => void;
    private groupByIndex: number;
    private sortImpl: ISort;
}
