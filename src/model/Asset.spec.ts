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
import { Asset, IParent } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { AssetEditorData } from "./AssetEditorData";
import { AssetGroup } from "./AssetGroup";
import { allAssetPropertyNames, AssetPropertyName, IAssetPropertiesIntersection } from "./AssetInterfaces";
import {
    getErc20TokensWalletProperties, getMiscAssetProperties, getPreciousMetalProperties, getSimpleCryptoWalletProperties,
} from "./AssetProperties";
import { BtcWallet } from "./BtcWallet";
import { BtgWallet } from "./BtgWallet";
import { CryptoWallet } from "./CryptoWallet";
import { DashWallet } from "./DashWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { Erc20TokenWallet } from "./Erc20TokenWallet";
import { EtcWallet } from "./EtcWallet";
import { EthWallet } from "./EthWallet";
import { GoldAsset } from "./GoldAsset";
import { LtcWallet } from "./LtcWallet";
import { MiscAsset } from "./MiscAsset";
import { PalladiumAsset } from "./PalladiumAsset";
import { PlatinumAsset } from "./PlatinumAsset";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { SilverAsset } from "./SilverAsset";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { AssetType } from "./validation/schemas/AssetType";
import { AssetTypeName } from "./validation/schemas/AssetTypeName";
import { IAssetProperties } from "./validation/schemas/IAssetProperties";
import { Erc20TokensWalletTypeName, IErc20TokensWallet } from "./validation/schemas/IErc20TokensWallet";
import { IErc20TokensWalletProperties } from "./validation/schemas/IErc20TokensWalletProperties";
import { IMiscAsset, MiscAssetTypeName } from "./validation/schemas/IMiscAsset";
import { IMiscAssetProperties } from "./validation/schemas/IMiscAssetProperties";
import { IPreciousMetalAsset, PreciousMetalAssetTypeName } from "./validation/schemas/IPreciousMetalAsset";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties";
import { ISimpleCryptoWallet, SimpleCryptoWalletTypeName } from "./validation/schemas/ISimpleCryptoWallet";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties";
import { WeightUnit } from "./validation/schemas/WeightUnit";
import { ZecWallet } from "./ZecWallet";

const arrayOfAll = <T>() =>
    <U extends Array<keyof T>>(...array: U & (Array<keyof T> extends Array<U[number]> ? unknown : never)) => array;

let randomValue = Date.now();

const getRandomData = (type: AssetTypeName, expectedPropertyNames: AssetPropertyName[]) => {
    const data = new AssetEditorData();
    data.type = type;

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

    return data;
};

const createAsset = <T, U>(ctor: new (parent: IParent, props: U) => T, props: U) => {
    const parent: IParent = {
        assets: {
            ordering: {
                groupBy: "type",
                otherGroupBys: ["location"],
            },
        },
        exchangeRate: 1,
    };

    return new ctor(parent, props);
};

const getPropertyValues = (
    object: Partial<IAssetPropertiesIntersection>, names: AssetPropertyName[],
): Map<string, unknown> => {
    const result = new Map<string, unknown>();

    for (const name of names) {
        result.set(name, object[name]);
    }

    return result;
};

// tslint:disable-next-line: ban-types
type PropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];

const expectProperty = <T, U, N extends PropertyNames<T> & string>(
    ctor: new (parent: IParent, props: U) => T, props: U, name: N, matcher: (x: jasmine.Matchers<T[N]>) => void,
) => {
    describe(ctor.name, () => describe(name, () => {
        it("value should meet expectations", () => matcher(expect(createAsset(ctor, props)[name])));
    }));
};

const expectPropertyThrowsError = <T, U, N extends PropertyNames<T> & string>(
    ctor: new (parent: IParent, props: U) => T, props: U, name: N, expectedMessage: string,
) => {
    describe(ctor.name, () => describe(name, () => {
        it("should throw", () => expect(() => createAsset(ctor, props)[name]).toThrowError(expectedMessage));
    }));
};

type MethodNames<T> = { [K in keyof T]: T[K] extends () => unknown ? K : never }[keyof T];

const testMethod = <T, U, N extends MethodNames<T> & string>(
    ctor: new (parent: IParent, props: U) => T, props: U, name: N, expectation: string, test: (object: T) => void,
) => {
    describe(ctor.name, () => describe(`${name}()`, () => it(expectation, () => test(createAsset(ctor, props)))));
};

const expectMethodThrowsError = <T, U, N extends MethodNames<T> & string>(
    ctor: new (parent: IParent, props: U) => T, props: U, name: N, expectedMessage: string,
) => {
    describe(ctor.name, () => describe(`${name}()`, () => {
        it("should throw", () => expect(createAsset(ctor, props)[name]).toThrowError(expectedMessage));
    }));
};

type PreciousMetalCtor = (new (parent: IParent, props: IPreciousMetalAssetProperties) => PreciousMetalAsset);

const testPreciousMetalAssetConstruction = (type: PreciousMetalAssetTypeName, ctor: PreciousMetalCtor) => {
    const expectedPropertyNames = arrayOfAll<IPreciousMetalAssetProperties>()(
        "description", "location", "quantity", "notes", "weight", "weightUnit", "fineness");
    const props = getPreciousMetalProperties(getRandomData(type, expectedPropertyNames));

    expectProperty(ctor, props, "isExpandable", (matcher) => matcher.toBe(false));
    expectProperty(ctor, props, "locationHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "unit", (matcher) => matcher.toBeDefined());
    expectProperty(ctor, props, "quantityHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "displayDecimals", (matcher) => matcher.toBeGreaterThanOrEqual(0));
    expectProperty(ctor, props, "unitValue", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "unitValueHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "totalValue", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "percent", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "hasActions", (matcher) => matcher.toBe(true));
    testMethod(
        ctor, props, "toJSON", "should return an object",
        (asset) => expect(asset.toJSON() instanceof Object).toBe(true));
    testMethod(
        ctor, props, "bundle", "should return an AssetBundle",
        (asset) => expect(asset.bundle() instanceof AssetBundle).toBe(true));
    testMethod(ctor, props, "expand", "should return undefined", (asset) => expect(asset.expand()).toBeUndefined());

    describe(ctor.name, () => {
        let expected: IPreciousMetalAsset;
        let sut: InstanceType<typeof ctor>;

        beforeEach(() => {
            expected = getPreciousMetalProperties(getRandomData(type, expectedPropertyNames));
            sut = createAsset(ctor, expected);
        });

        describe("constructor", () => {
            it("should copy parameter properties", () => {
                const actual = getPropertyValues(sut, allAssetPropertyNames);
                [...actual.keys()].filter((key) => actual.get(key) === undefined).forEach((key) => actual.delete(key));
                expect(actual).toEqual(getPropertyValues(expected, expectedPropertyNames));
            });
        });

        describe("type", () => {
            it("should be equal to a valid type", () => {
                expect(Object.keys(AssetType).includes(sut.type)).toBe(true);
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
    });
};

type SimpleCryptoWalletCtor = (new (parent: IParent, props: ISimpleCryptoWalletProperties) => CryptoWallet);

const testSimpleCryptoWalletConstruction = (type: SimpleCryptoWalletTypeName, ctor: SimpleCryptoWalletCtor) => {
    const expectedPropertyNames = arrayOfAll<ISimpleCryptoWalletProperties>()(
        "description", "location", "quantity", "notes", "address");
    const props = getSimpleCryptoWalletProperties(getRandomData(type, expectedPropertyNames));

    expectProperty(ctor, props, "isExpandable", (matcher) => matcher.toBe(false));
    expectProperty(ctor, props, "locationHint", (matcher) => matcher.toEqual(props.address ? props.address : ""));
    expectProperty(ctor, props, "unit", (matcher) => matcher.toBeDefined());
    expectProperty(ctor, props, "quantityHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "displayDecimals", (matcher) => matcher.toBeGreaterThanOrEqual(0));
    expectProperty(ctor, props, "unitValue", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "unitValueHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "totalValue", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "percent", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "hasActions", (matcher) => matcher.toBe(true));
    testMethod(
        ctor, props, "toJSON", "should return an object",
        (asset) => expect(asset.toJSON() instanceof Object).toBe(true));
    testMethod(
        ctor, props, "bundle", "should return an AssetBundle",
        (asset) => expect(asset.bundle() instanceof AssetBundle).toBe(true));
    testMethod(ctor, props, "expand", "should return undefined", (asset) => expect(asset.expand()).toBeUndefined());

    describe(ctor.name, () => {
        let expected: ISimpleCryptoWallet;
        let sut: InstanceType<typeof ctor>;

        beforeEach(() => {
            expected = getSimpleCryptoWalletProperties(getRandomData(type, expectedPropertyNames));
            sut = createAsset(ctor, expected);
        });

        describe("constructor", () => {
            it("should copy parameter properties", () => {
                const actual = getPropertyValues(sut, allAssetPropertyNames);
                [...actual.keys()].filter((key) => actual.get(key) === undefined).forEach((key) => actual.delete(key));
                expect(actual).toEqual(getPropertyValues(expected, expectedPropertyNames));
            });
        });

        describe("type", () => {
            it("should be equal to a valid type", () => {
                expect(Object.keys(AssetType).includes(sut.type)).toBe(true);
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
    });
};

type Erc20TokensWalletCtor = (new (parent: IParent, props: IErc20TokensWalletProperties) => Erc20TokensWallet);

const testErc20TokensWalletConstruction = (type: Erc20TokensWalletTypeName, ctor: Erc20TokensWalletCtor) => {
    const expectedPropertyNames = arrayOfAll<IErc20TokensWalletProperties>()(
        "description", "location", "notes", "address");
    const props = getErc20TokensWalletProperties(getRandomData(type, expectedPropertyNames));

    expectProperty(ctor, props, "isExpandable", (matcher) => matcher.toBe(false));
    expectProperty(ctor, props, "locationHint", (matcher) => matcher.toEqual(props.address ? props.address : ""));
    expectProperty(ctor, props, "unit", (matcher) => matcher.toBeDefined());
    expectProperty(ctor, props, "quantityHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "displayDecimals", (matcher) => matcher.toBeGreaterThanOrEqual(0));
    expectProperty(ctor, props, "unitValue", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "unitValueHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "totalValue", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "percent", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "hasActions", (matcher) => matcher.toBe(true));
    testMethod(
        ctor, props, "toJSON", "should return an object",
        (asset) => expect(asset.toJSON() instanceof Object).toBe(true));
    testMethod(
        ctor, props, "bundle", "should return an AssetBundle",
        (asset) => expect(asset.bundle() instanceof AssetBundle).toBe(true));
    testMethod(ctor, props, "expand", "should return undefined", (asset) => expect(asset.expand()).toBeUndefined());

    describe(ctor.name, () => {
        let expected: IErc20TokensWallet;
        let sut: InstanceType<typeof ctor>;

        beforeEach(() => {
            expected = getErc20TokensWalletProperties(getRandomData(type, expectedPropertyNames));
            sut = createAsset(ctor, expected);
        });

        describe("constructor", () => {
            it("should copy parameter properties", () => {
                const actual = getPropertyValues(sut, allAssetPropertyNames);
                [...actual.keys()].filter((key) => actual.get(key) === undefined).forEach((key) => actual.delete(key));
                expect(actual).toEqual(getPropertyValues(expected, expectedPropertyNames));
            });
        });

        describe("type", () => {
            it("should be equal to a valid type", () => {
                expect(Object.keys(AssetType).includes(sut.type)).toBe(true);
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
    });
};

type MiscAssetCtor = (new (parent: IParent, props: IMiscAssetProperties) => MiscAsset);

const testMiscAssetConstruction = (type: MiscAssetTypeName, ctor: MiscAssetCtor) => {
    const expectedPropertyNames = arrayOfAll<IMiscAssetProperties>()(
        "description", "location", "quantity", "notes", "value", "valueCurrency");
    const props = getMiscAssetProperties(getRandomData(type, expectedPropertyNames));

    expectProperty(ctor, props, "isExpandable", (matcher) => matcher.toBe(false));
    expectProperty(ctor, props, "locationHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "unit", (matcher) => matcher.toBeDefined());
    expectProperty(ctor, props, "quantityHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "displayDecimals", (matcher) => matcher.toBeGreaterThanOrEqual(0));
    expectProperty(ctor, props, "unitValue", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "unitValueHint", (matcher) => matcher.toEqual(""));
    expectProperty(ctor, props, "totalValue", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "percent", (matcher) => matcher.toBeUndefined());
    expectProperty(ctor, props, "hasActions", (matcher) => matcher.toBe(true));
    testMethod(
        ctor, props, "toJSON", "should return an object",
        (asset) => expect(asset.toJSON() instanceof Object).toBe(true));
    testMethod(
        ctor, props, "bundle", "should return an AssetBundle",
        (asset) => expect(asset.bundle() instanceof AssetBundle).toBe(true));
    testMethod(ctor, props, "expand", "should return undefined", (asset) => expect(asset.expand()).toBeUndefined());

    describe(ctor.name, () => {
        let expected: IMiscAsset;
        let sut: InstanceType<typeof ctor>;

        beforeEach(() => {
            expected = getMiscAssetProperties(getRandomData(type, expectedPropertyNames));
            sut = createAsset(ctor, expected);
        });

        describe("constructor", () => {
            it("should copy parameter properties", () => {
                const actual = getPropertyValues(sut, allAssetPropertyNames);
                [...actual.keys()].filter((key) => actual.get(key) === undefined).forEach((key) => actual.delete(key));
                expect(actual).toEqual(getPropertyValues(expected, expectedPropertyNames));
            });
        });

        describe("type", () => {
            it("should be equal to a valid type", () => {
                expect(Object.keys(AssetType).includes(sut.type)).toBe(true);
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
    });
};

const testQueries = <T extends Asset, U extends IAssetProperties>(
    ctor: new (parent: IParent, props: U) => T, props: U,
) => {
    describe("bundle() (before queryData())", () => {
        let sut: InstanceType<typeof ctor>;
        let bundle: ReturnType<typeof sut.bundle>;

        beforeEach(() => {
            sut = createAsset(ctor, props);
            bundle = sut.bundle();
        });

        describe("assets", () => {
            it("should contain assets with undefined quantity, unitValue and totalValue", () => {
                for (const asset of bundle.assets) {
                    if (asset instanceof CryptoWallet) {
                        expect(asset.quantity).toBeUndefined();
                    } else {
                        expect(asset.quantity).toBe(1);
                    }

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

        beforeAll(
            async () => {
                sut = createAsset(ctor, props);
                bundle = sut.bundle();
                await bundle.queryData();
                ({ assets } = bundle);
            },
            20000);

        describe("assets", () => {
            it("should contain assets with defined quantity, unitValue and totalValue", () => {
                for (const asset of assets) {
                    expect(asset.quantity).toBeGreaterThanOrEqual(0);
                    expect(asset.unitValue).toBeGreaterThanOrEqual(0);
                    expect(asset.totalValue).toBeGreaterThanOrEqual(0);
                }
            });

            it("should contain assets with the given properties", async () => {
                for (const asset of assets) {
                    expect(asset.type).toBe(sut.type);
                    expect(asset.description).toBe(sut.description);
                    expect(asset.location).toBe(sut.location);
                    expect(asset.notes).toBe(sut.notes);
                    expect(asset.editableAsset).toBe(sut);

                    if (asset instanceof CryptoWallet) {
                        if (!(sut instanceof CryptoWallet)) {
                            fail("Unexpected asset type!");
                        } else {
                            expect(asset.address).toBe(sut.address);
                        }
                    }

                    if (asset instanceof Erc20TokenWallet) {
                        expect(sut instanceof Erc20TokensWallet).toBe(true);
                        await expectAsync(asset.queryData()).toBeRejected();
                        expect(() => asset.interface).toThrow();
                        expect(() => asset.toJSON()).toThrow();
                        expect(() => asset.bundle()).toThrow();
                    }
                }
            });
        });

        describe("deleteAsset()", () => {
            it("should remove an asset", () => {
                const { length } = assets;
                expect(length).toBeGreaterThan(0);
                const assetToDelete = assets[0];
                bundle.deleteAsset(assetToDelete);
                expect(assets.length).toBe(length - 1);
                expect(assets.includes(assetToDelete)).toBe(false);
            });
        });
    });
};

testPreciousMetalAssetConstruction("Silver", SilverAsset);
testPreciousMetalAssetConstruction("Palladium", PalladiumAsset);
testPreciousMetalAssetConstruction("Platinum", PlatinumAsset);
testPreciousMetalAssetConstruction("Gold", GoldAsset);
testSimpleCryptoWalletConstruction("Bitcoin", BtcWallet);
testSimpleCryptoWalletConstruction("Litecoin", LtcWallet);
testSimpleCryptoWalletConstruction("Dash", DashWallet);
testSimpleCryptoWalletConstruction("Bitcoin Gold", BtgWallet);
testErc20TokensWalletConstruction("ERC20 Tokens", Erc20TokensWallet);
testSimpleCryptoWalletConstruction("Ethereum Classic", EtcWallet);
testSimpleCryptoWalletConstruction("Ethereum", EthWallet);
testSimpleCryptoWalletConstruction("Zcash", ZecWallet);
testMiscAssetConstruction("Misc", MiscAsset);

const testSimpleCryptoWallet = (
    ctor: new (parent: IParent, props: ISimpleCryptoWalletProperties) => SimpleCryptoWallet, address: string,
) => {
    describe(`${ctor.name} with address ${address}`, () => {
        testQueries(ctor, { description: "Spending", address });
    });
};

const testPreciousMetalAsset = (
    ctor: new (parent: IParent, props: IPreciousMetalAssetProperties) => PreciousMetalAsset,
) => {
    describe(`${ctor.name}`, () => {
        testQueries(ctor, { description: "Bars", weight: 1, weightUnit: WeightUnit.kg, fineness: 0.999, quantity: 1 });
    });
};

// cSpell: disable
testSimpleCryptoWallet(
    BtcWallet,
    "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz");
testSimpleCryptoWallet(BtcWallet, "1MyMTPFeFWuPKtVa7W9Lc2wDi7ZNm6kN4a");
testSimpleCryptoWallet(LtcWallet, "LS6dQU1M1Asx5ATT5gopFo53UfQ9dhLhmP");
testSimpleCryptoWallet(DashWallet, "XjB1d1pNT9nfcCKp1N7AQCmzPNiVg6YEzn");
testSimpleCryptoWallet(BtgWallet, "GJjz2Du9BoJQ3CPcoyVTHUJZSj62i1693U");
testSimpleCryptoWallet(EtcWallet, "0x2387f8DB786d43528fFD3b0bD776e2BA39DD3832");
testSimpleCryptoWallet(EthWallet, "0x00C5E04176d95A286fccE0E68c683Ca0bfec8454");
testSimpleCryptoWallet(ZecWallet, "t1Tncf8SM9yPsFsWjRMAf6GXobSDhkQ6DEN");

describe(`${Erc20TokensWallet.name} with address 0x00C5E04176d95A286fccE0E68c683Ca0bfec8454`, () => {
    testQueries(Erc20TokensWallet, { description: "Spending", address: "0x00C5E04176d95A286fccE0E68c683Ca0bfec8454" });
});
// cSpell: enable

testPreciousMetalAsset(SilverAsset);
testPreciousMetalAsset(PalladiumAsset);
testPreciousMetalAsset(PlatinumAsset);
testPreciousMetalAsset(GoldAsset);

describe(MiscAsset.name, () => {
    testQueries(MiscAsset, { description: "Cash", value: 20, valueCurrency: "USD", quantity: 1 });
});

describe("no assets", () => {
    expectProperty(AssetGroup, [], "isExpanded", (matcher) => matcher.toBe(false));
    expectProperty(AssetGroup, [], "isExpandable", (matcher) => matcher.toBe(true));
    expectProperty(AssetGroup, [], "type", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, [], "description", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, [], "location", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, [], "unit", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, [], "fineness", (matcher) => matcher.toBeUndefined());
    expectProperty(AssetGroup, [], "quantity", (matcher) => matcher.toBeUndefined());
    expectProperty(AssetGroup, [], "quantityHint", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, [], "displayDecimals", (matcher) => matcher.toBe(0));
    expectProperty(AssetGroup, [], "notes", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, [], "unitValue", (matcher) => matcher.toBeUndefined());
    expectProperty(AssetGroup, [], "unitValueHint", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, [], "totalValue", (matcher) => matcher.toBe(0));
    expectProperty(AssetGroup, [], "hasActions", (matcher) => matcher.toBe(false));
    expectPropertyThrowsError(AssetGroup, [], "interface", "AssetGroup cannot be edited.");
    expectMethodThrowsError(AssetGroup, [], "toJSON", "AssetGroup cannot be serialized.");
    testMethod(AssetGroup, [], "expand", "should toggle isExpanded", (assetGroup) => {
        expect(assetGroup.isExpanded).toBe(false);
        assetGroup.expand();
        expect(assetGroup.isExpanded).toBe(true);
        assetGroup.expand();
        expect(assetGroup.isExpanded).toBe(false);
    });
});

describe("single asset", () => {
    const asset = createAsset(
        SilverAsset, { description: "Bars", weight: 1, weightUnit: WeightUnit.kg, fineness: 0.999, quantity: 1 });
    beforeAll(() => asset.queryData());
    expectProperty(AssetGroup, [asset], "isExpanded", (matcher) => matcher.toBe(false));
    expectProperty(AssetGroup, [asset], "isExpandable", (matcher) => matcher.toBe(true));
    expectProperty(AssetGroup, [asset], "type", (matcher) => matcher.toEqual(asset.type));
    expectProperty(AssetGroup, [asset], "description", (matcher) => matcher.toEqual(asset.description));
    expectProperty(AssetGroup, [asset], "location", (matcher) => matcher.toEqual(asset.location));
    expectProperty(AssetGroup, [asset], "unit", (matcher) => matcher.toEqual(asset.unit));
    expectProperty(AssetGroup, [asset], "fineness", (matcher) => matcher.toBe(asset.fineness));
    expectProperty(AssetGroup, [asset], "quantity", (matcher) => matcher.toBe(asset.quantity));
    expectProperty(AssetGroup, [asset], "quantityHint", (matcher) => matcher.toEqual(asset.quantityHint));
    expectProperty(AssetGroup, [asset], "displayDecimals", (matcher) => matcher.toBe(asset.displayDecimals));
    expectProperty(AssetGroup, [asset], "notes", (matcher) => matcher.toEqual(`${asset.notes}\n`));
    expectProperty(AssetGroup, [asset], "unitValue", (matcher) => matcher.toBe(asset.unitValue));
    expectProperty(AssetGroup, [asset], "unitValueHint", (matcher) => matcher.toEqual(asset.unitValueHint));
    expectProperty(AssetGroup, [asset], "totalValue", (matcher) => matcher.toBe(asset.totalValue));
    expectProperty(AssetGroup, [asset], "hasActions", (matcher) => matcher.toBe(false));
});

describe("two assets", () => {
    const assets = [
        createAsset(
            SilverAsset, { description: "Bars", weight: 1, weightUnit: WeightUnit.kg, fineness: 0.999, quantity: 1 }),
        createAsset(BtcWallet, { description: "Spending", quantity: 1 }),
    ];

    beforeAll(async () => {
        for (const asset of assets) {
            await asset.queryData();
        }
    });

    expectProperty(AssetGroup, assets, "isExpanded", (matcher) => matcher.toBe(false));
    expectProperty(AssetGroup, assets, "isExpandable", (matcher) => matcher.toBe(true));
    expectProperty(AssetGroup, assets, "type", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, assets, "description", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, assets, "location", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, assets, "unit", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, assets, "fineness", (matcher) => matcher.toBeUndefined());
    expectProperty(AssetGroup, assets, "quantity", (matcher) => matcher.toBeUndefined());
    expectProperty(AssetGroup, assets, "quantityHint", (matcher) => matcher.toEqual(""));
    expectProperty(AssetGroup, assets, "displayDecimals", (matcher) => matcher.toBe(0));
    expectProperty(AssetGroup, assets, "notes", (matcher) => matcher.toEqual("\n\n"));
    expectProperty(AssetGroup, assets, "unitValue", (matcher) => matcher.toBeUndefined());
    expectProperty(AssetGroup, assets, "unitValueHint", (matcher) => matcher.toEqual(""));
    expectProperty(
        AssetGroup,
        assets,
        "totalValue",
        // tslint:disable-next-line: no-non-null-assertion
        () => assets.map((a) => a.totalValue).filter((v) => !!v).reduce((p, c) => p! + c!, 0));
    expectProperty(AssetGroup, assets, "hasActions", (matcher) => matcher.toBe(false));
});
