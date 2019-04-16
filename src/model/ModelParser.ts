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

import { IModel } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { AssetInput } from "./AssetInput";
import { Currency } from "./Currency";
import { IModelParameters, ISerializedModel, Model } from "./Model";
import { Ordering } from "./Ordering";
import { ParseErrorMessage } from "./ParseErrorMessage";
import { Unknown } from "./Unknown";
import { GroupBy } from "./validation/schemas/GroupBy";
import { ISort } from "./validation/schemas/ISort";
import { Value } from "./Value";

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
            return `${(e as Error).message}.`;
        }

        if (!Value.hasNumberProperty(rawModel, this.versionName)) {
            return ParseErrorMessage.getPropertyTypeMismatch(this.versionName, rawModel, 0);
        }

        const version = rawModel[this.versionName];

        if (version !== 1) {
            return ParseErrorMessage.getUnknownPropertyValue(this.versionName, version);
        }

        return this.parseBundles(rawModel);
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

    private static getModelName<T extends keyof ISerializedModel>(name: T) {
        return name;
    }

    private static getSortName<T extends keyof ISort>(name: T) {
        return name;
    }

    private static parseBundles(rawModel: Unknown) {
        if (!Value.hasArrayProperty(rawModel, this.bundlesName)) {
            return ParseErrorMessage.getPropertyTypeMismatch(this.bundlesName, rawModel, []);
        }

        const params: IModelParameters = {
            ...this.parseOptionalProperties(rawModel),
            ...this.parseOptionalViewProperties(rawModel),
            createBundles: new Array<(model: IModel) => AssetBundle>(),
        };

        for (const rawBundle of rawModel.bundles) {
            const createBundle = AssetInput.parseBundle(rawBundle);

            if (!(createBundle instanceof Function)) {
                return createBundle;
            }

            params.createBundles.push(createBundle);
        }

        return new Model(params);
    }

    private static parseOptionalProperties(rawModel: Unknown) {
        const result: { name?: string; wasSavedToFile?: boolean; hasUnsavedChanges?: boolean } = {};

        if (Value.hasStringProperty(rawModel, this.nameName)) {
            const name = rawModel[this.nameName];

            if (name.length > 0) {
                result.name = name;
            }
        }

        if (Value.hasBooleanProperty(rawModel, this.wasSavedToFileName)) {
            result.wasSavedToFile = rawModel[this.wasSavedToFileName];
        }

        if (Value.hasBooleanProperty(rawModel, this.hasUnsavedChangesName)) {
            result.hasUnsavedChanges = rawModel[this.hasUnsavedChangesName];
        }

        return result;
    }

    private static parseOptionalViewProperties(rawModel: Unknown) {
        const result: { currency?: keyof typeof Currency; groupBy?: GroupBy; sort?: ISort } = {};

        if (Value.hasStringProperty(rawModel, this.currencyName)) {
            const currency = rawModel[this.currencyName];

            if (currency in Currency) {
                result.currency = currency as keyof typeof Currency;
            }
        }

        if (Value.hasStringProperty(rawModel, this.groupByName)) {
            const groupBy = rawModel[this.groupByName];

            if (this.isGroupBy(groupBy)) {
                result.groupBy = groupBy;
            }
        }

        if (Value.hasObjectProperty(rawModel, this.sortName)) {
            const sort = rawModel[this.sortName];

            if (this.isSort(sort)) {
                result.sort = sort;
            }
        }

        return result;
    }

    private static isSort(sort: Unknown): sort is ISort {
        return Value.hasStringProperty(sort, this.sortByName) && Ordering.isSortBy(sort.by) &&
            Value.hasBooleanProperty(sort, this.sortDescendingName);
    }

    private static isGroupBy(groupBy: string): groupBy is GroupBy {
        return Ordering.groupBys.findIndex((g) => g === groupBy) >= 0;
    }
}
