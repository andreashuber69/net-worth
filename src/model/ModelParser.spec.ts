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

import { GroupBy, SortBy } from "./Asset";
import { AssetCollection } from "./AssetCollection";
import { AssetGroup } from "./AssetGroup";
import { Currency } from "./Currency";
import { EnumInfo } from "./EnumInfo";
import { Model } from "./Model";
import { ModelParser } from "./ModelParser";
import { Ordering } from "./Ordering";
import { SilverAsset } from "./SilverAsset";
import { WeightUnit } from "./WeightUnit";

class BlobUtility {
    public static toArrayBuffer(blob: Blob) {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = () => reject("Unable to read blob.");
            reader.readAsArrayBuffer(blob);
        });
    }
}

const loadTestFile = async (name: string) => {
    const url = `/base/src/model/ModelParser.spec/${name}`;
    let response: Response;

    try {
        response = await window.fetch(url);
    } catch (e) {
        throw new Error(`Network Error: ${e}`);
    }

    if (!response.ok) {
        throw new Error(`Response Status: ${response.status} ${response.statusText}`);
    }

    return new TextDecoder().decode(new Uint8Array(await BlobUtility.toArrayBuffer(await response.blob())));
};

type Properties<T, U extends keyof T = never> =
    // tslint:disable-next-line: ban-types
    Pick<T, Exclude<{ [K in keyof T]: T[K] extends Function ? never : K }[keyof T], U>>;
type IOrderingProperties = Properties<Ordering>;
type IAssetCollectionProperties =
    Properties<AssetCollection, "grouped" | "ordering"> & { readonly ordering: IOrderingProperties};
type IModelProperties = Properties<Model, "assets"> & { readonly assets: IAssetCollectionProperties };

const expectError = (fileName: string, message: string) => {
    describe(fileName, () => {
        it("should fail to parse", async () => {
            const json = await loadTestFile(fileName);
            expect(ModelParser.parse(json)).toEqual(message);
        });
    });
};

const capitalize = (str: string) => `${str[0].toUpperCase()}${str.substr(1)}`;

const getExpectedProperties = (
    name = "Unnamed",
    wasSavedToFile = false,
    hasUnsavedChanges = false,
    currency: keyof typeof Currency = "USD",
    groupBy: GroupBy = "type",
    sortBy: SortBy = "totalValue",
    descending = true,
    isEmpty = true,
): IModelProperties => {
    const groupBys: GroupBy[] = ["type", "location"];
    const otherGroupBys = groupBys.filter((value) => value !== groupBy);

    return {
        name,
        fileExtension: ".assets",
        fileName: `${name}.assets`,
        wasSavedToFile,
        hasUnsavedChanges,
        title: `${name}${hasUnsavedChanges ? " (Modified)" : ""} - Net Worth`,
        currencies: EnumInfo.getMemberNames(Currency),
        currency,
        assets: {
            ordering: {
                groupBys,
                groupBy,
                groupByLabel: capitalize(groupBy),
                groupByLabels: groupBys.map(capitalize),
                otherGroupBys,
                otherGroupByLabels: otherGroupBys.map(capitalize),
                sort: { by: sortBy, descending },
            },
            isEmpty,
            grandTotalValue: isEmpty ? 0 : undefined,
        },
        exchangeRate: undefined,
        onChanged: undefined,
    };
};

const expectToEqual = (actual: { [key: string]: any }, expected: { [key: string]: any }) => {
    for (const key in expected) {
        if (expected.hasOwnProperty(key)) {
            const actualValue = actual[key];
            const expectedValue = expected[key];

            if (((typeof actualValue) === "object") && ((typeof expectedValue) === "object")) {
                // tslint:disable-next-line: no-unsafe-any
                expectToEqual(actualValue, expectedValue);
            } else {
                expect(actualValue).toEqual(expectedValue);
            }
        }
    }
};

const expectModel = (fileName: string, properties: IModelProperties, checkModel: (model: Model) => void) => {
    describe(fileName, () => {
        it("should parse", async () => {
            const result = ModelParser.parse(await loadTestFile(fileName));

            if (result instanceof Model) {
                // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14579#issuecomment-341326257
                expectToEqual(result, properties);
                checkModel(result);
            } else {
                fail(result);
            }
        });
    });
};

const expectEmptyModel = (fileName: string) => {
    const expectedProperties = getExpectedProperties();

    expectModel(fileName, expectedProperties, (model) => {
        const expectedJson = {
            version: 1,
            name: "Unnamed",
            wasSavedToFile: false,
            hasUnsavedChanges: false,
            currency: "USD",
            groupBy: "type",
            sort: {
                by: "totalValue",
                descending: true,
            },
            bundles: [],
        };

        expect(JSON.parse(model.toJsonString())).toEqual(expectedJson);
    });
};

describe("ModelParser.parse", () => {
    expectError("Empty.assets", "Unexpected end of JSON input.");
    expectError(
        "MissingVersion.assets",
        "'version': The type of the value (undefined) does not match the expected type(s) number.");
    expectError(
        "InvalidVersion.assets",
        "'version': The type of the value (string) does not match the expected type(s) number.");
    expectError(
        "OutOfRangeVersion.assets",
        "'version': The value '2' does not match any of the possible values.");
    expectError(
        "InvalidBundles.assets",
        "'bundles': The type of the value (number) does not match the expected type(s) Array.");
    expectError(
        "MissingAssetType.assets",
        "'type': The type of the value (undefined) does not match the expected type(s) string.");
    expectError(
        "InvalidAssetType.assets",
        "'type': The value 'Flower' does not match any of the possible values.");

    expectEmptyModel("Minimal.assets");
    expectEmptyModel("EmptyName.assets");
    expectEmptyModel("InvalidCurrency.assets");
    expectEmptyModel("InvalidGroupBy.assets");
    expectEmptyModel("InvalidSort.assets");

    expectModel(
        "Silver.assets",
        getExpectedProperties("Joe", false, true, "CHF", "location", "unitValue", false, false),
        (model) => {
            const [ group ] = model.assets.grouped;

            if (group instanceof AssetGroup) {
                const [ asset ] = group.assets;

                if (asset instanceof SilverAsset) {
                    expect(asset.type).toEqual("Silver");
                    expect(asset.description).toEqual("Coins");
                    expect(asset.location).toEqual("Home");
                    expect(asset.weight).toEqual(1);
                    expect(asset.weightUnit).toEqual(WeightUnit["t oz"]);
                    expect(asset.unit).toEqual(`${asset.weight} ${WeightUnit[asset.weightUnit]}`);
                    expect(asset.fineness).toBe(0.999);
                    expect(asset.displayDecimals).toBe(0);
                    expect(asset.notes).toEqual("Whatever");
                    expect(asset.superType).toEqual("Precious Metal");
                    expect(asset.quantity).toEqual(100);
                    expect(asset.quantityHint).toEqual("");
                    expect(asset.parent).toBe(model);
                    expect(asset.isExpandable).toBe(false);
                    expect(asset.locationHint).toEqual("");
                    expect(asset.unitValue).toBeUndefined();
                    expect(asset.unitValueHint).toEqual("");
                    expect(asset.totalValue).toBeUndefined();
                    expect(asset.percent).toBeUndefined();
                    expect(asset.hasActions).toBe(true);
                    expect(asset.editableAsset).toBe(asset);
                } else {
                    fail(`Asset is not an instance of ${SilverAsset.name}.`);
                }
            } else {
                fail(`Asset is not an instance of ${AssetGroup.name}.`);
            }
        },
    );
});
