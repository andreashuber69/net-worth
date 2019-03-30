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

import { AssetGroup } from "./AssetGroup";
import { Currency } from "./Currency";
import { EnumInfo } from "./EnumInfo";
import { Model } from "./Model";
import { ModelParser } from "./ModelParser";
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

const expectDefaultProperties = (model: Model, isEmpty: boolean) => {
    expect(model.name).toEqual("Unnamed");
    expect(model.fileExtension).toEqual(".assets");
    expect(model.fileName).toEqual("Unnamed.assets");
    expect(model.wasSavedToFile).toBe(false);
    expect(model.hasUnsavedChanges).toBe(false);
    expect(model.title).toEqual("Unnamed - Net Worth");
    expect(model.currencies).toEqual(EnumInfo.getMemberNames(Currency));
    expect(model.currency).toEqual("USD");

    const { assets } = model;
    const { ordering } = assets;
    expect(ordering.groupBys).toEqual([ "type", "location" ]);
    expect(ordering.groupBy).toEqual("type");
    expect(ordering.groupByLabel).toEqual("Type");
    expect(ordering.otherGroupBys).toEqual([ "location" ]);
    expect(ordering.otherGroupByLabels).toEqual([ "Location" ]);
    expect(ordering.sort).toEqual({ by: "totalValue", descending: true });

    expect(assets.isEmpty).toBe(isEmpty);

    expect(model.exchangeRate).toBeUndefined();
    expect(model.onChanged).toBeUndefined();
};

const expectModel = (fileName: string, isEmpty: boolean, checkModel: (model: Model) => void) => {
    it(`should parse ${fileName}`, async () => {
        const result = ModelParser.parse(await loadTestFile(fileName));

        if (result instanceof Model) {
            expectDefaultProperties(result, isEmpty);
            checkModel(result);
        } else {
            fail(result);
        }
    });
};

const expectError = (fileName: string, message: string) => {
    it(`should fail to parse ${fileName}`, async () => {
        const json = await loadTestFile(fileName);
        expect(ModelParser.parse(json)).toEqual(message);
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
    expectModel("Minimal.assets", true, (model) => {
        const expected = {
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

        expect(JSON.parse(model.toJsonString())).toEqual(expected);
    });

    expectModel("Silver.assets", false, (model) => {
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
    });
});
