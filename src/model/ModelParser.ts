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

import { GroupBy } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { AssetInput } from "./AssetInput";
import { Currency } from "./Currency";
import { ISerializedModel, ISort, Model } from "./Model";
import { Unknown, Value } from "./Value";

export class ModelParser {
    /**
     * Returns a [[Model]] object that is equivalent to the passed JSON string or returns a string that describes why
     * the parse process failed.
     * @description This is typically called with a string that was returned by [[toJsonString]].
     * @param json The string to parse
     */
    public static parse(json: string) {
        let rawModel: Unknown | null;

        try {
            rawModel = JSON.parse(json) as Unknown | null;
        } catch (e) {
            return (e as Error).message;
        }

        if (!Value.hasNumberProperty(rawModel, this.versionName)) {
            return Value.getPropertyTypeMismatch(this.versionName, rawModel, 0);
        }

        const version = rawModel[this.versionName];

        if (version !== 1) {
            return Value.getUnknownPropertyValue(this.versionName, version);
        }

        const model = new Model();
        this.parseOptional(rawModel, model);

        if (!Value.hasArrayProperty(rawModel, this.bundlesName)) {
            return Value.getPropertyTypeMismatch(this.bundlesName, rawModel, []);
        }

        for (const rawBundle of rawModel.bundles) {
            const bundle = AssetInput.parseBundle(model, rawBundle);

            if (!(bundle instanceof AssetBundle)) {
                return bundle;
            }

            model.bundles.push(bundle);
        }

        model.update(...model.bundles);

        return model;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly versionName = ModelParser.getModelName("version");
    private static readonly nameName = ModelParser.getModelName("name");
    private static readonly wasSavedToFileName = ModelParser.getModelName("wasSavedToFile");
    private static readonly hasUnsavedChangesName = ModelParser.getModelName("hasUnsavedChanges");
    private static readonly currencyName = ModelParser.getModelName("currency");
    private static readonly groupByName = ModelParser.getModelName("groupBy");
    private static readonly sortName = ModelParser.getModelName("sort");
    private static readonly sortByName = ModelParser.getSortName("by");
    private static readonly sortDescendingName = ModelParser.getSortName("descending");
    private static readonly bundlesName = ModelParser.getModelName("bundles");

    private static parseOptional(rawModel: Unknown | null, model: Model) {
        if (Value.hasStringProperty(rawModel, this.nameName)) {
            const name = rawModel[this.nameName];

            if (name.length > 0) {
                model.name = name;
            }
        }

        if (Value.hasBooleanProperty(rawModel, this.wasSavedToFileName)) {
            model.wasSavedToFile = rawModel[this.wasSavedToFileName];
        }

        if (Value.hasBooleanProperty(rawModel, this.hasUnsavedChangesName)) {
            model.hasUnsavedChanges = rawModel[this.hasUnsavedChangesName];
        }

        if (Value.hasStringProperty(rawModel, this.currencyName)) {
            const currency = rawModel[this.currencyName];

            if (currency in Currency) {
                model.currency = currency as keyof typeof Currency;
            }
        }

        if (Value.hasStringProperty(rawModel, this.groupByName)) {
            const groupBy = rawModel[this.groupByName];

            if (this.isGroupBy(groupBy)) {
                model.groupBy = groupBy;
            }
        }

        if (Value.hasObjectProperty(rawModel, this.sortName)) {
            const sort = rawModel[this.sortName];

            if (this.isSort(sort)) {
                model.sort = sort;
            }
        }
    }

    private static getModelName<T extends keyof ISerializedModel>(name: T) {
        return name;
    }

    private static getSortName<T extends keyof ISort>(name: T) {
        return name;
    }

    private static isSort(sort: Unknown): sort is ISort {
        return Value.hasStringProperty(sort, this.sortByName) && Model.isSortBy(sort.by) &&
            Value.hasBooleanProperty(sort, this.sortDescendingName);
    }

    private static isGroupBy(groupBy: string): groupBy is GroupBy {
        return Model.groupBys.findIndex((g) => g === groupBy) >= 0;
    }
}
