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
import { AssetBundle } from "./AssetBundle";
import { AssetEditorData } from "./AssetEditorData";
import { allAssetPropertyNames, AssetPropertyName, IAssetIntersection } from "./AssetInterfaces";
import { AssetProperties } from "./AssetProperties";
import { AssetType } from "./AssetTypes";
import { BtcWallet } from "./BtcWallet";
import { BtgWallet } from "./BtgWallet";
import { CryptoWallet } from "./CryptoWallet";
import { DashWallet } from "./DashWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { Erc20TokenWallet } from "./Erc20TokenWallet";
import { EtcWallet } from "./EtcWallet";
import { EthWallet } from "./EthWallet";
import { GoldAsset } from "./GoldAsset";
import { IAssetProperties } from "./IAssetProperties";
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { IMiscAssetProperties } from "./IMiscAsset";
import { IPreciousMetalAssetProperties } from "./IPreciousMetalAsset";
import { LtcWallet } from "./LtcWallet";
import { MiscAsset } from "./MiscAsset";
import { PalladiumAsset } from "./PalladiumAsset";
import { PlatinumAsset } from "./PlatinumAsset";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { SilverAsset } from "./SilverAsset";
import { ZecWallet } from "./ZecWallet";

const arrayOfAll = <T>() =>
    <U extends Array<keyof T>>(...array: U & (Array<keyof T> extends Array<U[number]> ? unknown : never)) => array;

// tslint:disable-next-line: ban-types
const getExpectedPropertyNames = (ctor: Function & { prototype: unknown }) => {

    switch (ctor) {
        case PreciousMetalAsset:
            return arrayOfAll<IPreciousMetalAssetProperties>()(
                "description", "location", "quantity", "notes", "weight", "weightUnit", "fineness");
        case CryptoWallet:
            return arrayOfAll<ICryptoWalletProperties>()("description", "location", "quantity", "notes", "address");
        case MiscAsset:
            return arrayOfAll<IMiscAssetProperties>()(
                "description", "location", "quantity", "notes", "value", "valueCurrency");
        default:
            throw new Error();
    }
};

const getSut = <T extends Asset, U extends IAssetProperties>(ctor: new(model: IModel, props: U) => T, props: U) => {
    const model: IModel = {
        assets: {
            ordering: {
                groupBy: "type",
                otherGroupBys: [ "location" ],
            },
        },
        exchangeRate: 1,
    };

    return { expected: props, sut: new ctor(model, props) };
};

const getPropertyValues = (object: Partial<IAssetIntersection>, names: AssetPropertyName[]): Map<string, unknown> => {
    const result = new Map<string, unknown>();

    for (const name of names) {
        result.set(name, object[name]);
    }

    return result;
};

const testAsset = <T extends U, U extends PreciousMetalAsset | CryptoWallet | MiscAsset>(
    // tslint:disable-next-line: ban-types
    ctor: new(model: IModel, props: IAssetIntersection) => T, baseCtor: Function & { prototype: U })  => {
    const expectedPropertyNames =  getExpectedPropertyNames(baseCtor);

    describe(ctor.name, () => {
        let expected: IAssetIntersection;
        let sut: InstanceType<typeof ctor>;

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

            ({ expected, sut } = getSut(ctor, new AssetProperties(data)));
        });

        describe("constructor", () => {
            it("should copy parameter properties", () => {
                const actual = getPropertyValues(sut, allAssetPropertyNames);
                [...actual.keys()].filter((key) => actual.get(key) === undefined).forEach((key) => actual.delete(key));
                expect(actual).toEqual(getPropertyValues(expected, expectedPropertyNames));
            });
        });

        describe("isExpandable", () => {
            it("should equal false", () => {
                expect(sut.isExpandable).toEqual(false);
            });
        });

        describe("type", () => {
            it("should be equal to a valid type", () => {
                expect(Object.keys(AssetType).includes(sut.type)).toBe(true);
            });
        });

        describe("locationHint", () => {
            it("should be a string", () => {
                expect(typeof sut.locationHint).toEqual("string");
            });
        });

        describe("unit", () => {
            it("should be defined", () => {
                expect(sut.unit).toBeDefined();
            });
        });

        describe("quantityHint", () => {
            it("should be an empty string", () => {
                expect(sut.quantityHint).toEqual("");
            });
        });

        describe("displayDecimals", () => {
            it("should be a number >= 0", () => {
                expect(sut.displayDecimals).toBeGreaterThanOrEqual(0);
            });
        });

        describe("unitValue", () => {
            it("should be undefined", () => {
                expect(sut.unitValue).toBeUndefined();
            });
        });

        describe("unitValueHint", () => {
            it("should be an empty string", () => {
                expect(sut.unitValueHint).toEqual("");
            });
        });

        describe("totalValue", () => {
            it("should be undefined", () => {
                expect(sut.totalValue).toBeUndefined();
            });
        });

        describe("percent", () => {
            it("should be undefined", () => {
                expect(sut.percent).toBeUndefined();
            });
        });

        describe("hasActions", () => {
            it("should be true", () => {
                expect(sut.hasActions).toBe(true);
            });
        });

        describe("editableAsset", () => {
            it("should be equal to sut", () => {
                expect(sut.editableAsset).toBe(sut);
            });
        });

        describe("interface", () => {
            it("should be equal to sut", () => {
                expect(sut.interface as object).toBe(sut);
            });
        });

        describe("toJSON()", () => {
            it("should return an object", () => {
                expect(typeof sut.toJSON()).toEqual("object");
            });
        });

        describe("bundle()", () => {
            it("should return a bundle", () => {
                expect(sut.bundle() instanceof AssetBundle).toBe(true);
            });
        });

        describe("expand()", () => {
            it("should return undefined", () => {
                expect(sut.expand()).toBeUndefined();
            });
        });
    });
};

const testCryptoWallet =
    (ctor: new(model: IModel, props: ICryptoWalletProperties) => CryptoWallet, address: string) => {
    describe(`${ctor.name} with address ${address}`, () => {
        describe("bundle() (before queryData())", () => {
            let sut: InstanceType<typeof ctor>;
            let bundle: ReturnType<typeof sut.bundle>;

            beforeEach(() => {
                ({ sut } = getSut(ctor, { description: "Spending", address }));
                bundle = sut.bundle();
            });

            describe("assets", () => {
                it("should contain assets with undefined quantity, unitValue and totalValue", () => {
                    for (const asset of bundle.assets) {
                        expect(asset.quantity).toBeUndefined();
                        expect(asset.unitValue).toBeUndefined();
                        expect(asset.totalValue).toBeUndefined();
                    }
                });
            });

            describe("toJSON()", () => {
                it("should return an object", () => {
                    expect(typeof bundle.toJSON()).toEqual("object");
                });
            });
        });

        describe("bundle() (after queryData())", () => {
            let sut: InstanceType<typeof ctor>;
            let bundle: ReturnType<typeof sut.bundle>;
            let assets: typeof bundle.assets;

            beforeAll(async () => {
                ({ sut } = getSut(ctor, { description: "Spending", address }));
                bundle = sut.bundle();
                await bundle.queryData();
                ({ assets } = bundle);
            });

            describe("assets", () => {
                it("should contain assets with defined quantity, unitValue and totalValue", () => {
                    for (const asset of bundle.assets) {
                        expect(asset.quantity).toBeGreaterThanOrEqual(0);
                        expect(asset.unitValue).toBeGreaterThanOrEqual(0);
                        expect(asset.totalValue).toBeGreaterThanOrEqual(0);
                    }
                });

                it("should contain assets with the given properties", () => {
                    for (const asset of assets) {
                        expect(asset.type).toBe(sut.type);
                        expect(asset.description).toBe(sut.description);
                        expect(asset.location).toBe(sut.location);
                        expect(asset.notes).toBe(sut.notes);
                        expect(asset.editableAsset).toBe(sut);
                        expect(asset.address).toBe(sut.address);

                        if (asset instanceof Erc20TokenWallet) {
                            expect(sut instanceof Erc20TokensWallet).toBe(true);
                            expect(() => asset.interface).toThrow();
                            expect(() => asset.toJSON()).toThrow();
                        }
                    }
                });
            });

            describe("deleteAsset()", () => {
                it("should remove an asset", () => {
                    const { length } = assets;
                    expect(length).toBeGreaterThan(0);
                    const assetToDelete = bundle.assets[0];
                    bundle.deleteAsset(assetToDelete);
                    expect(bundle.assets.length).toBe(length - 1);
                    expect(bundle.assets.includes(assetToDelete)).toBe(false);
                });
            });
        });
    });
};

testAsset(SilverAsset, PreciousMetalAsset);
testAsset(PalladiumAsset, PreciousMetalAsset);
testAsset(PlatinumAsset, PreciousMetalAsset);
testAsset(GoldAsset, PreciousMetalAsset);
testAsset(BtcWallet, CryptoWallet);
testAsset(LtcWallet, CryptoWallet);
testAsset(DashWallet, CryptoWallet);
testAsset(BtgWallet, CryptoWallet);
testAsset(Erc20TokensWallet, CryptoWallet);
testAsset(EtcWallet, CryptoWallet);
testAsset(EthWallet, CryptoWallet);
testAsset(ZecWallet, CryptoWallet);
testAsset(MiscAsset, MiscAsset);

// cSpell: disable
// tslint:disable-next-line: max-line-length
testCryptoWallet(BtcWallet, "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz");
testCryptoWallet(BtcWallet, "1MyMTPFeFWuPKtVa7W9Lc2wDi7ZNm6kN4a");
testCryptoWallet(LtcWallet, "LS6dQU1M1Asx5ATT5gopFo53UfQ9dhLhmP");
testCryptoWallet(DashWallet, "XjB1d1pNT9nfcCKp1N7AQCmzPNiVg6YEzn");
testCryptoWallet(BtgWallet, "GJjz2Du9BoJQ3CPcoyVTHUJZSj62i1693U");
testCryptoWallet(Erc20TokensWallet, "0x00C5E04176d95A286fccE0E68c683Ca0bfec8454");
testCryptoWallet(EtcWallet, "0x2387f8DB786d43528fFD3b0bD776e2BA39DD3832");
testCryptoWallet(EthWallet, "0x00C5E04176d95A286fccE0E68c683Ca0bfec8454");
testCryptoWallet(ZecWallet, "t1Tncf8SM9yPsFsWjRMAf6GXobSDhkQ6DEN");
// cSpell: enable
