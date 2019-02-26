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
import { Asset, IModel } from "./Asset";
import { AssetEditorData } from "./AssetEditorData";
import { allAssetPropertyNames, AssetPropertyName, IAssetIntersection } from "./AssetInterfaces";
import { AssetProperties } from "./AssetProperties";
import { BtcWallet } from "./BtcWallet";
import { BtgWallet } from "./BtgWallet";
import { DashWallet } from "./DashWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { EtcWallet } from "./EtcWallet";
import { EthWallet } from "./EthWallet";
import { GoldAsset } from "./GoldAsset";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { IMiscAssetProperties } from "./IMiscAsset";
import { IPreciousMetalAssetProperties } from "./IPreciousMetalAsset";
import { LtcWallet } from "./LtcWallet";
import { MiscAsset } from "./MiscAsset";
import { PalladiumAsset } from "./PalladiumAsset";
import { PlatinumAsset } from "./PlatinumAsset";
import { SilverAsset } from "./SilverAsset";
import { ZecWallet } from "./ZecWallet";

let expected: IAssetIntersection;

const getSut = <T extends Asset>(ctor: new(model: IModel, props: IAssetIntersection) => T) => {
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

const getPropertyValues = (object: Partial<IAssetIntersection>, names: AssetPropertyName[]): Map<string, unknown> => {
    const result = new Map<string, unknown>();

    for (const name of names) {
        result.set(name, object[name]);
    }

    return result;
};

const testAsset = <T extends Asset>(
    ctor: new(model: IModel, props: IAssetIntersection) => T,
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
                const actual = getPropertyValues(sut, allAssetPropertyNames);
                [...actual.keys()].filter((key) => actual.get(key) === undefined).forEach((key) => actual.delete(key));
                expect(actual).toEqual(getPropertyValues(expected, expectedPropertyNames));
            });
        });
    });
};

const arrayOfAll = <T>() =>
    <U extends Array<keyof T>>(...array: U & (Array<keyof T> extends Array<U[number]> ? unknown : never)) => array;

const preciousMetalPropertyNames = arrayOfAll<IPreciousMetalAssetProperties>()(
    "description", "location", "quantity", "notes", "weight", "weightUnit", "fineness");

testAsset(SilverAsset, preciousMetalPropertyNames);
testAsset(PalladiumAsset, preciousMetalPropertyNames);
testAsset(PlatinumAsset, preciousMetalPropertyNames);
testAsset(GoldAsset, preciousMetalPropertyNames);

const cryptoWalletPropertyNames =
    arrayOfAll<ICryptoWalletProperties>()("description", "location", "quantity", "notes", "address");

testAsset(BtcWallet, cryptoWalletPropertyNames);
testAsset(LtcWallet, cryptoWalletPropertyNames);
testAsset(DashWallet, cryptoWalletPropertyNames);
testAsset(BtgWallet, cryptoWalletPropertyNames);
testAsset(Erc20TokensWallet, cryptoWalletPropertyNames);
testAsset(EtcWallet, cryptoWalletPropertyNames);
testAsset(EthWallet, cryptoWalletPropertyNames);
testAsset(ZecWallet, cryptoWalletPropertyNames);

const miscAssetPropertyNames =
    arrayOfAll<IMiscAssetProperties>()("description", "location", "quantity", "notes", "value", "valueCurrency");

testAsset(MiscAsset, miscAssetPropertyNames);
