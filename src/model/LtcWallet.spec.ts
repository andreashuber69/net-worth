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

// tslint:disable-next-line:no-implicit-dependencies no-submodule-imports
import { IModel } from "./Asset";
import { AssetEditorData } from "./AssetEditorData";
import { AssetPropertyName, IAssetIntersection } from "./AssetInterfaces";
import { AssetProperties } from "./AssetProperties";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { LtcWallet } from "./LtcWallet";
import { RealCryptoWallet } from "./RealCryptoWallet";

let expected: IAssetIntersection;

const getSut = <T extends RealCryptoWallet>(ctor: new(model: IModel, props: ICryptoWalletProperties) => T) => {
    const model: IModel = {
        assets: {
            ordering: {
                groupBy: "type",
                otherGroupBys: [ "location" ],
            },
        },
    };

    return new ctor(model, expected);
};

const getPropertyValues =
    (object: Partial<IAssetIntersection>, names: AssetPropertyName[]): Partial<IAssetIntersection> => {

        const result: { [key: string]: unknown } = {};

        for (const name of names) {
            result[name] = object[name];
        }

        return result;
    };

const allPropertyNames: AssetPropertyName[] = [
    "description", "location", "quantity", "notes", "weight",
    "weightUnit", "fineness", "address", "value", "valueCurrency",
];

const testAsset = <T extends RealCryptoWallet>(
    ctor: new(model: IModel, props: ICryptoWalletProperties) => T,
    expectedPropertyNames: AssetPropertyName[]) => {
    describe(ctor.name, () => {
        let sut: T;

        beforeEach(() => {
            let randomValue = Date.now();
            const data = new AssetEditorData();

            for (const name of expectedPropertyNames) {
                switch (name) {
                    case "weightUnit":
                        // TODO: Randomize
                        data[name] = "kg";
                        break;
                    case "valueCurrency":
                        // TODO: Randomize
                        data[name] = "USD";
                        break;
                    default:
                        data[name] = (++randomValue).toString();
                }
            }

            expected = new AssetProperties(data);
            sut = getSut(ctor);
        });

        describe("constructor", () => {
            it("should copy parameter properties", () => {
                expect(getPropertyValues(sut, expectedPropertyNames)).toEqual(
                    getPropertyValues(expected, expectedPropertyNames));
            });
        });
    });
};

testAsset(LtcWallet, [ "description", "location", "quantity", "notes", "address" ]);
