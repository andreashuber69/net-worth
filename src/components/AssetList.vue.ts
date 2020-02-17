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

import { Component } from "vue-property-decorator";

import { Asset } from "../model/Asset";
import { Model } from "../model/Model";
import { GroupBys } from "../model/Ordering";
import { SortBy } from "../model/validation/schemas/SortBy.schema";

// tslint:disable-next-line:no-default-import
import AssetEditor from "./AssetEditor.vue";
// tslint:disable-next-line:no-default-import
import { ColumnInfo, ColumnName } from "./ColumnInfo";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

type ITableHeader = {
    readonly value: Exclude<ColumnName, SortBy>;
    readonly text: string;
    readonly sortable: false;
} | {
    readonly value: SortBy;
    readonly text: string;
};

interface IOptions {
    readonly sortBy: SortBy[];
    readonly sortDesc: boolean[];
}

const numericColumnNames = ["fineness", "unitValue", "quantity", "totalValue", "percent"] as const;
type NumericColumnName = keyof Pick<Asset, typeof numericColumnNames[number]>;

@Component({ components: { AssetEditor } })
/** Implements the asset list UI. */
// tslint:disable-next-line:no-default-export
export default class AssetList extends ComponentBase<Model> {
    public get headers() {
        const allColumnNames = ColumnInfo.getAllNames(this.checkedValue.assets.ordering.groupBys);
        const visibleColumnNames: readonly ColumnName[] = allColumnNames.filter(
            (name) => allColumnNames.indexOf(name) < ColumnInfo.getTotalCount(this.optionalColumnCount));

        return AssetList.getHeaders(this.checkedValue.assets.ordering.groupBys).filter(
            (h) => visibleColumnNames.includes(h.value));
    }

    public get options() {
        return {
            sortBy: [this.checkedValue.assets.ordering.sort.by],
            sortDesc: [this.checkedValue.assets.ordering.sort.descending],
        };
    }

    public set options(options: IOptions) {
        this.checkedValue.assets.ordering.sort = {
            by: options.sortBy.length && options.sortBy[0] || this.checkedValue.assets.ordering.sort.by,
            descending: options.sortDesc.length && options.sortDesc[0] || false,
        };
    }

    public get grandTotalValue() {
        return this.checkedValue.assets.grandTotalValue;
    }

    /** Provides a value indicating how many columns are currently visible. */
    public get totalColumnCount() {
        return ColumnInfo.getTotalCount(this.optionalColumnCount);
    }

    public get grandTotalLabelColumnCount() {
        // This is the minimal column span for the grand total label.
        let result = 2;

        if (this.optionalColumnCount >= 1) {
            // We need to add to the minimum the number of columns that are added *after* the total value column has
            // appeared.
            result += (ColumnInfo.getTotalCount(this.optionalColumnCount) - ColumnInfo.getTotalCount(1));
        }

        return result;
    }

    public isVisible(columnName: ColumnName) {
        return ColumnInfo.getAllNames(this.checkedValue.assets.ordering.groupBys).indexOf(columnName) <
            ColumnInfo.getTotalCount(this.optionalColumnCount);
    }

    public format(num: number | undefined, maximumFractionDigits: number, minimumFractionDigits?: number) {
        // This must be an instance function, because it is called from the template. The following avoids
        // "Class method does not use 'this'." error.
        this.toString();

        return Format.value(num, maximumFractionDigits, minimumFractionDigits);
    }

    /**
     * @description Calculates a string that needs to be prepended to a given number such that its decimal point is
     * aligned with all other numbers in the same column.
     */
    public getPrefix(columnName: NumericColumnName, value: number | undefined) {
        if ((value === undefined) || Number.isNaN(value)) {
            return "";
        }

        const maxPrefix = this.maxPrefixes.get(columnName) || ["", false];
        const valueFormatted = this.format(Math.trunc(value), 0);

        // The following logic is necessary so that negative values will be displayed in alignment with their
        // positive brothers and sisters. In a column with at least one negative value, all positive values are
        // first prefixed with an invisible - sign, before potentially also being prefixed with zeroes and grouping
        // characters.
        const prefixWithoutSign = maxPrefix[0].substr(
            0, maxPrefix[0].length - valueFormatted.length + ((value < 0) && 1 || 0));

        return ((value < 0) || !maxPrefix[1]) ? prefixWithoutSign : `${prefixWithoutSign}-`;
    }

    public async onAdd() {
        const newAsset = await this.assetEditor.showDialog(this.checkedValue);

        if (newAsset) {
            this.checkedValue.assets.add(newAsset);
        }
    }

    public async onEdit(asset: Asset) {
        const changedAsset = await this.assetEditor.showDialog(this.checkedValue, asset);

        if (changedAsset) {
            this.checkedValue.assets.replace(asset, changedAsset);
        }
    }

    public onDelete(asset: Asset) {
        this.checkedValue.assets.delete(asset);
    }

    public mounted() {
        this.timer = setInterval(() => this.onIntervalElapsed(), 100);
    }

    public beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getHeaders(groupBys: GroupBys): readonly ITableHeader[] {
        return [
            { value: "expand", text: "", sortable: false },
            { value: groupBys[0], text: AssetList.capitalize(groupBys[0]) },
            { value: groupBys[1], text: AssetList.capitalize(groupBys[1]) },
            { value: "description", text: "Description" },
            { value: "unit", text: "Unit", sortable: false },
            { value: "fineness", text: "Fineness", sortable: false },
            { value: "unitValue", text: "Unit Value" },
            { value: "quantity", text: "Quantity", sortable: false },
            { value: "totalValue", text: "Total Value" },
            { value: "percent", text: "%", sortable: false },
            { value: "more", text: "", sortable: false },
        ];
    }

    private static capitalize(str: string) {
        return `${str[0].toUpperCase()}${str.substr(1)}`;
    }

    private optionalColumnCount = ColumnInfo.maxOptionalCount;
    private timer?: NodeJS.Timer;
    private previousOffset = Number.NaN;

    private get assetEditor() {
        return this.getControl("editor") as AssetEditor;
    }

    private get maxPrefixes(): ReadonlyMap<NumericColumnName, [string, boolean]> {
        const result = new Map<NumericColumnName, [string, boolean]>(
            numericColumnNames.map((name) => [name, ["", false]]));
        result.set("totalValue", [this.formatZeroes(this.checkedValue.assets.grandTotalValue), false]);
        result.set("percent", [this.formatZeroes(100), false]);

        for (const property of numericColumnNames) {
            let [longest, hasNegativeValues] = result.get(property) || ["", false];

            for (const asset of this.checkedValue.assets.grouped) {
                const value = asset[property];
                hasNegativeValues = hasNegativeValues || ((value || 0) < 0);
                const current = this.formatZeroes(value);
                longest = current.length > longest.length ? current : longest;
            }

            result.set(property, [longest, hasNegativeValues]);
        }

        return result;
    }

    private formatZeroes(num: number | undefined) {
        const numToFormat = (num === undefined) || Number.isNaN(num) ? undefined : Math.abs(num);

        return this.format(numToFormat && Math.trunc(numToFormat), 0).replace(/\d/g, "0");
    }

    private onIntervalElapsed() {
        const element = this.$el as HTMLElement;

        if (this.previousOffset === element.offsetLeft) {
            if ((this.optionalColumnCount > 0) && (element.offsetLeft < 0)) {
                --this.optionalColumnCount;
            } else if ((this.optionalColumnCount < ColumnInfo.maxOptionalCount) &&
                (element.offsetLeft * 2 > element.offsetWidth /
                    (ColumnInfo.requiredCount + this.optionalColumnCount) * 3)) {
                ++this.optionalColumnCount;
            }
        }

        this.previousOffset = element.offsetLeft;
    }
}
