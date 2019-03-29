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

import { Currency } from "./Currency";
import { EnumInfo } from "./EnumInfo";
import { Model } from "./Model";
import { ModelParser } from "./ModelParser";

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

const expectModel = (fileName: string, checkModel: (model: Model) => void) => {
    it(`should parse ${fileName}`, async () => {
        const result = ModelParser.parse(await loadTestFile(fileName));

        if (result instanceof Model) {
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
    expectModel("Minimal.assets", (model) => {
        expect(model.name).toEqual("Unnamed");
        expect(model.fileExtension).toEqual(".assets");
        expect(model.fileName).toEqual("Unnamed.assets");
        expect(model.wasSavedToFile).toBe(false);
        expect(model.hasUnsavedChanges).toBe(false);
        expect(model.title).toEqual("Unnamed - Net Worth");
        expect(model.currencies).toEqual(EnumInfo.getMemberNames(Currency));
        expect(model.currency).toEqual("USD");
        expect(model.assets.isEmpty).toBe(true);
        expect(model.exchangeRate).toBeUndefined();
        expect(model.onChanged).toBeUndefined();

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
});
