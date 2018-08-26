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

import { Asset, GroupBy, IModel } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { AssetGroup } from "./AssetGroup";
import { ISort, Ordering } from "./Ordering";

interface IBundleParameters {
    model: IModel;
    bundles: AssetBundle[];
    groupBy: GroupBy | undefined;
    sort: ISort | undefined;
}

export class GroupingImpl {
    public readonly bundles: AssetBundle[];
    public readonly groups = new Array<AssetGroup>();
    public readonly ordering: Ordering;

    public constructor(params: IBundleParameters) {
        this.ordering = new Ordering({
            onGroupChanged: () => this.onGroupChanged(),
            onSortChanged: () => this.doSort(),
            groupBy: params.groupBy,
            sort: params.sort,
        });

        this.model = params.model;
        this.bundles = params.bundles;
        this.update(...this.bundles);
    }

    public update(...newBundles: AssetBundle[]) {
        this.updateImpl(newBundles).catch((error) => console.error(error));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static async queryBundleData(bundle: AssetBundle, id: number) {
        await bundle.queryData();

        return id;
    }

    private readonly model: IModel;

    private onGroupChanged() {
        this.groups.length = 0;
        this.update();
    }

    private doSort() {
        this.groups.sort((l, r) => this.compare(l, r));

        for (const group of this.groups) {
            group.assets.sort((l, r) => this.compare(l, r));
        }
    }

    private async updateImpl(newBundles: AssetBundle[]) {
        this.updateGroups();
        const promises = new Map<number, Promise<number>>(
            newBundles.map<[number, Promise<number>]>((b, i) => [ i, GroupingImpl.queryBundleData(b, i) ]));
        const delayId = Number.MAX_SAFE_INTEGER;

        while (promises.size > 0) {
            if (!promises.has(delayId)) {
                promises.set(delayId, new Promise((resolve) => setTimeout(resolve, 1000, delayId)));
            }

            const index = await Promise.race(promises.values());

            if (index === delayId) {
                this.updateGroups();
            }

            promises.delete(index);
        }
    }

    private updateGroups() {
        const newGroups = this.getGroups();

        // Remove no longer existing groups
        for (let index = 0; index < this.groups.length;) {
            if (!newGroups.has(this.groups[index][this.ordering.groupBy])) {
                this.groups.splice(index, 1);
            } else {
                ++index;
            }
        }

        // Update existing groups with new assets
        for (const newGroup of newGroups) {
            const existingGroup = this.groups.find((g) => g[this.ordering.groupBy] === newGroup[0]);

            if (existingGroup === undefined) {
                this.groups.push(new AssetGroup(this.model, newGroup[1]));
            } else {
                existingGroup.assets.splice(0, existingGroup.assets.length, ...newGroup[1]);
            }
        }

        this.doSort();
    }

    private getGroups() {
        const result = new Map<string, Asset[]>();

        for (const bundle of this.bundles) {
            for (const asset of bundle.assets) {
                const groupName = asset[this.ordering.groupBy];
                const groupAssets = result.get(groupName);

                if (groupAssets === undefined) {
                    result.set(groupName, [ asset ]);
                } else {
                    groupAssets.push(asset);
                }
            }
        }

        return result;
    }

    private compare(left: Asset, right: Asset) {
        return (this.ordering.sort.descending ? -1 : 1) * this.compareImpl(left, right);
    }

    private compareImpl(left: Asset, right: Asset) {
        const leftProperty = left[this.ordering.sort.by];
        const rightProperty = right[this.ordering.sort.by];

        if (leftProperty === rightProperty) {
            return 0;
        } else if (leftProperty === undefined) {
            return -1;
        } else if (rightProperty === undefined) {
            return 1;
        } else if (leftProperty < rightProperty) {
            return -1;
        } else {
            return 1;
        }
    }
}
