// https://github.com/andreashuber69/net-worth#--
import { Component } from "vue-property-decorator";

import type { Asset } from "../model/Asset";
import type { Model } from "../model/Model";
import type { GroupBys } from "../model/Ordering";
import type { SortBy } from "../model/validation/schemas/SortBy.schema";

import AssetEditor from "./AssetEditor.vue";
import type { ColumnName } from "./ColumnInfo";
import { ColumnInfo } from "./ColumnInfo";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";
import type { NumericColumnName } from "./NumericTableCell.vue";
import NumericTableCell, { numericColumnNames } from "./NumericTableCell.vue";

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

// eslint-disable-next-line @typescript-eslint/naming-convention
@Component({ components: { AssetEditor, NumericTableCell } })
/** Implements the asset list UI. */
// eslint-disable-next-line import/no-default-export
export default class AssetList extends ComponentBase<Model> {
    public get headers() {
        const allColumnNames = ColumnInfo.getAllNames(this.checkedValue.assets.ordering.groupBys);
        const visibleColumnNames: readonly ColumnName[] = allColumnNames.filter(
            (name) => allColumnNames.indexOf(name) < ColumnInfo.getTotalCount(this.optionalColumnCount),
        );

        return AssetList.getHeaders(this.checkedValue.assets.ordering.groupBys).filter(
            (h) => visibleColumnNames.includes(h.value),
        );
    }

    public get options() {
        return {
            sortBy: [this.checkedValue.assets.ordering.sort.by],
            sortDesc: [this.checkedValue.assets.ordering.sort.descending],
        };
    }

    public set options(options: IOptions) {
        this.checkedValue.assets.ordering.sort = {
            by: (options.sortBy.length && options.sortBy[0]) || this.checkedValue.assets.ordering.sort.by,
            descending: (options.sortDesc.length && options.sortDesc[0]) || false,
        };
    }

    public get loading() {
        return this.checkedValue.assets.grandTotalValue === undefined;
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

    public get maxPrefixes(): ReadonlyMap<NumericColumnName, [string, boolean]> {
        const result = this.initMaxPrefixes();

        for (const property of numericColumnNames) {
            let [longest, hasNegativeValues] = result.get(property) ?? ["", false];

            for (const asset of this.checkedValue.assets.grouped) {
                const value = asset[property];
                hasNegativeValues = hasNegativeValues || ((value ?? 0) < 0);
                const current = AssetList.formatZeroes(value);
                longest = current.length > longest.length ? current : longest;
            }

            result.set(property, [longest, hasNegativeValues]);
        }

        return result;
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
        this.timer = setInterval(() => void this.adjustTableColumnCount(), 500);
    }

    public beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
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

    private static formatZeroes(num: number | undefined) {
        const numToFormat = (num === undefined) || Number.isNaN(num) ? undefined : Math.abs(num);

        return Format.value(numToFormat && Math.trunc(numToFormat), 0).replace(/\d/ug, "0");
    }

    private static capitalize(str: string) {
        return `${str[0].toUpperCase()}${str.substr(1)}`;
    }

    private optionalColumnCount = ColumnInfo.maxOptionalCount;
    private timer?: NodeJS.Timer;

    private get assetEditor() {
        return this.getControl("editor") as AssetEditor;
    }

    private initMaxPrefixes() {
        const result =
            new Map<NumericColumnName, [string, boolean]>(numericColumnNames.map((name) => [name, ["", false]]));
        result.set("totalValue", [AssetList.formatZeroes(this.checkedValue.assets.grandTotalValue), false]);
        result.set("percent", [AssetList.formatZeroes(100), false]);

        return result;
    }

    private adjustTableColumnCount() {
        this.$nextTick(() => void this.onRendered());
    }

    private onRendered() {
        const element = this.$el as HTMLElement;

        // If we detect that the table column count needs to be adjusted, we need to have this function be called again
        // to see whether the count is now correct.
        if ((this.optionalColumnCount > 0) && (element.offsetLeft < 0)) {
            --this.optionalColumnCount;
            this.adjustTableColumnCount();
        } else if ((this.optionalColumnCount < ColumnInfo.maxOptionalCount) &&
            (element.offsetLeft * 2 > element.offsetWidth /
                (ColumnInfo.requiredCount + this.optionalColumnCount) * 3)) {
            ++this.optionalColumnCount;
            this.adjustTableColumnCount();
        }
    }
}
