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
import { AssetCollection } from "./AssetCollection";
import { AssetGroup } from "./AssetGroup";
import { CryptoWallet } from "./CryptoWallet";
import { EnumInfo } from "./EnumInfo";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { Erc20TokenWallet } from "./Erc20TokenWallet";
import { Model } from "./Model";
import { ModelParser } from "./ModelParser";
import { Ordering } from "./Ordering";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { SilverAsset } from "./SilverAsset";
import { Currency } from "./validation/schemas/Currency";
import { GroupBy } from "./validation/schemas/GroupBy";
import { SortBy } from "./validation/schemas/SortBy";
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

type IExpectedProperties<T, U extends keyof T = never> =
    // tslint:disable-next-line: ban-types
    Pick<T, Exclude<{ [K in keyof T]: T[K] extends Function ? never : K }[keyof T], U>>;
type IExpectedOrderingProperties = IExpectedProperties<Ordering>;
type IExpectedAssetCollectionProperties =
    IExpectedProperties<AssetCollection, "grouped" | "ordering" | "grandTotalValue"> &
    { readonly ordering: IExpectedOrderingProperties };
type IExpectedModelProperties =
    IExpectedProperties<Model, "assets" | "exchangeRate"> & { readonly assets: IExpectedAssetCollectionProperties };

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
): IExpectedModelProperties => {
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
        },
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

const expectModel = (fileName: string, properties: IExpectedModelProperties, checkModel: (model: Model) => void) => {
    describe(fileName, () => {
        it("should parse", async () => {
            const result = ModelParser.parse(await loadTestFile(fileName));

            if (result instanceof Model) {
                await result.assets.idle();
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

type IExpectedAssetProperties<T extends Asset> =
    IExpectedProperties<T, "key" | "unitValue" | "totalValue" | "percent" | "interface" | "parent" | "editableAsset">;

const getExpectedPreciousMetalProperties = <T extends PreciousMetalAsset>(
    type: T["type"], description: string, location: string, weight: number,
    weightUnit: WeightUnit, fineness: number, notes: string, quantity: number) => ({
        type,
        description,
        location,
        weight,
        weightUnit,
        unit: `${weight} ${WeightUnit[weightUnit]}`,
        fineness,
        displayDecimals: 0 as 0,
        notes,
        superType: "Precious Metal" as "Precious Metal",
        quantity,
        quantityHint: "",
        isExpandable: false,
        locationHint: "",
        unitValueHint: "",
        hasActions: true,
    });

const getExpectedCryptoProperties = <T extends CryptoWallet, U extends number>(
    type: T["type"], description: string, location: string, unit: string, displayDecimals: U, address: string,
    notes: string, quantity: number) => ({
        type,
        description,
        location,
        unit,
        fineness: undefined,
        displayDecimals,
        notes,
        superType: "Crypto Currency" as "Crypto Currency",
        quantity,
        quantityHint: "",
        isExpandable: false,
        locationHint: address,
        address,
        unitValueHint: "",
        hasActions: true,
    });

describe("ModelParser.parse", () => {
    expectError("Empty.assets", "Unexpected end of JSON input");
    expectError("MissingVersion.assets", "data should have required property 'version'");
    expectError("InvalidVersion.assets", "data.version should be number");
    expectError("OutOfRangeVersion.assets", "data.version should be equal to one of the allowed values");
    expectError("InvalidBundles.assets", "data.bundles should be array");
    expectError(
        "MissingPrimaryAsset.assets",
        // tslint:disable-next-line: max-line-length
        "data.bundles[0] should have required property 'deletedAssets', data.bundles[0] should have required property 'primaryAsset', data.bundles[0] should have required property 'primaryAsset', data.bundles[0] should have required property 'primaryAsset', data.bundles[0] should match some schema in anyOf");
    expectError(
        "MissingAssetType.assets",
        // tslint:disable-next-line: max-line-length
        "data.bundles[0] should have required property 'deletedAssets', data.bundles[0].primaryAsset should have required property 'type', data.bundles[0].primaryAsset should have required property 'type', data.bundles[0].primaryAsset should have required property 'type', data.bundles[0] should match some schema in anyOf");
    expectError(
        "InvalidAssetType.assets",
        // tslint:disable-next-line: max-line-length
        "data.bundles[0] should have required property 'deletedAssets', data.bundles[0].primaryAsset.type should be equal to one of the allowed values, data.bundles[0].primaryAsset.type should be equal to one of the allowed values, data.bundles[0].primaryAsset.type should be equal to one of the allowed values, data.bundles[0] should match some schema in anyOf");
    expectError(
        "MissingRequiredProperties.assets",
        `'description': A value is required.
'weight': A value is required.
'weightUnit': A value is required.
'fineness': A value is required.
'quantity': A value is required.
`);
    expectError(
        "InvalidValueProperties1.assets",
        `'location': data should be string
'weight': data should be >= 0.001
'weightUnit': data should be equal to one of the allowed values
'fineness': data should be <= 0.999999
'quantity': data should be multiple of 1
`);
    expectError(
        "InvalidValueProperties2.assets",
        `'value': data should be number
'valueCurrency': The value '5' does not match any of the possible values.
`);
    expectError(
        "InvalidBtcWallet.assets",
        `'address': A value is required for either the Address or the Quantity (not both).
'quantity': A value is required for either the Address or the Quantity (not both).
`);

    expectEmptyModel("Minimal.assets");
    expectEmptyModel("EmptyName.assets");
    expectError("InvalidCurrency.assets", "data.currency should be equal to one of the allowed values");
    expectError("InvalidGroupBy.assets", "data.groupBy should be equal to one of the allowed values");
    expectError("InvalidSort.assets", "data.sort should have required property 'by'");

    expectModel(
        "Silver.assets",
        getExpectedProperties("Joe", false, true, "CHF", "location", "unitValue", false, false),
        (model) => {
            const [ group ] = model.assets.grouped;

            if (group instanceof AssetGroup) {
                const [ asset ] = group.assets;

                if (asset instanceof SilverAsset) {
                    const expected: IExpectedAssetProperties<SilverAsset> =
                        getExpectedPreciousMetalProperties<SilverAsset>(
                            "Silver", "Coins", "Home", 1, WeightUnit["t oz"], 0.999, "Whatever", 100);
                    expectToEqual(asset, expected);

                    expect(asset.key).toBeGreaterThan(0);
                    expect(asset.unitValue).toBeGreaterThan(0);

                    if ((asset.unitValue !== undefined) && (asset.quantity !== undefined)) {
                        expect(asset.totalValue).toBe(asset.unitValue * asset.quantity);
                    } else {
                        fail("unitValue or quantity are unexpectedly undefined.");
                    }

                    expect(asset.percent).toBe(100);
                } else {
                    fail(`Asset is not an instance of ${SilverAsset.name}.`);
                }
            } else {
                fail(`Asset is not an instance of ${AssetGroup.name}.`);
            }
        },
    );

    expectModel(
        "Erc20TokensWallet.assets",
        getExpectedProperties("Unnamed", false, false, "USD", "type", "totalValue", true, false),
        (model) => {
            const [ group ] = model.assets.grouped;

            if (group instanceof AssetGroup) {
                for (const asset of group.assets) {
                    if (asset instanceof Erc20TokenWallet) {
                        // cSpell: ignore YOVI
                        if (asset.unit === "YOVI") {
                            fail("Deleted asset is available.");
                        }

                        const expected: IExpectedAssetProperties<Erc20TokensWallet> =
                            getExpectedCryptoProperties<Erc20TokensWallet, 6>(
                                "ERC20 Tokens", "Spending", "", asset.unit,
                                6, "0x00C5E04176d95A286fccE0E68c683Ca0bfec8454", "", asset.quantity || -1);
                        expectToEqual(asset, expected);

                        expect(asset.key).toBeGreaterThan(0);
                        expect(asset.unitValue).toBeGreaterThanOrEqual(0);

                        if ((asset.unitValue !== undefined) && (asset.quantity !== undefined)) {
                            expect(asset.totalValue).toBe(asset.unitValue * asset.quantity);
                        } else {
                            fail("unitValue or quantity are unexpectedly undefined.");
                        }
                    } else {
                        fail(`Asset is not an instance of ${Erc20TokensWallet.name}.`);
                    }
                }
            } else {
                fail(`Asset is not an instance of ${AssetGroup.name}.`);
            }
        },
    );
});
