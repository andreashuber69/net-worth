// Copyright (C) 2018 Andreas Huber Dönni
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

import { Asset, GroupBy, SortBy } from "./Asset";

export interface ISort {
    /** Provides the name of the property by which the asset list is currently sorted. */
    readonly by: SortBy;

    /** Provides a value indicating whether the sort order is descending. */
    readonly descending: boolean;
}

interface IOrderingParameters {
    // tslint:disable-next-line:prefer-method-signature
    readonly onGroupChanged: () => void;
    // tslint:disable-next-line:prefer-method-signature
    readonly onSortChanged: () => void;
    readonly groupBy?: GroupBy;
    readonly sort?: ISort;
}

export interface IOrdering {
    readonly groupBy: GroupBy;
    readonly otherGroupBys: GroupBy[];
}

/** Provides information how assets are ordered (grouped and sorted) in the main model of the application. */
export class Ordering implements IOrdering {
    /** Provides the property names by which the asset list can be grouped. */
    public static readonly groupBys: GroupBy[] = [ Asset.typeName, Asset.locationName ];

    public static isSortBy(sortBy: string | undefined): sortBy is SortBy {
        switch (sortBy) {
            case Asset.typeName:
            case Asset.descriptionName:
            case Asset.locationName:
            case Asset.unitValueName:
            case Asset.totalValueName:
                return true;
            default:
                return false;
        }
    }

    /** Provides the property names by which the asset list can be grouped. */
    public readonly groupBys = Ordering.groupBys;

    /** Provides the labels for the properties by which the asset list can be grouped. */
    public get groupByLabels() {
        return this.groupBys.map((g) => Ordering.capitalize(g));
    }

    /** Provides the name of the property by which the asset list is currently grouped. */
    public get groupBy() {
        return this.groupByImpl;
    }

    public set groupBy(groupBy: GroupBy) {
        this.groupByImpl = groupBy;
        this.onGroupChanged();
    }

    /** Provides the label for the property by which the asset list is currently grouped. */
    public get groupByLabel() {
        return Ordering.capitalize(this.groupBy);
    }

    /** Provides the property names by which the asset list is currently *not* grouped. */
    public get otherGroupBys() {
        const result = Array.from(this.groupBys);
        result.splice(result.indexOf(this.groupBy), 1);

        return result;
    }

    /** Provides the labels for the properties by which the asset list is currently *not* grouped. */
    public get otherGroupByLabels() {
        return this.otherGroupBys.map((g) => Ordering.capitalize(g));
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
        this.onGroupChanged = params.onGroupChanged;
        this.onSortChanged = params.onSortChanged;
        this.groupByImpl = params.groupBy || Asset.typeName;
        this.sortImpl = params.sort || { by: Asset.totalValueName, descending: true };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static capitalize(str: string) {
        return `${str[0].toUpperCase()}${str.substr(1)}`;
    }

    // tslint:disable-next-line:prefer-method-signature
    private readonly onGroupChanged: () => void;
    // tslint:disable-next-line:prefer-method-signature
    private readonly onSortChanged: () => void;
    private groupByImpl: GroupBy;
    private sortImpl: ISort;
}
