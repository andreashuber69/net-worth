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
import { ICryptoWalletProperties } from "./ICryptoWallet";
import { LtcWallet } from "./LtcWallet";
import { RealCryptoWallet } from "./RealCryptoWallet";

const testAsset = <T extends RealCryptoWallet>(ctor: new(model: IModel, props: ICryptoWalletProperties) => T) => {
    describe(ctor.name, () => {
        let expected: ICryptoWalletProperties;
        let sut: T;

        beforeEach(() => {
            const randomValue = Date.now();

            expected = {
                description: randomValue.toString(),
                location: (randomValue + 1).toString(),
                quantity: randomValue + 2,
                address: (randomValue + 3).toString(),
                notes: (randomValue + 4).toString(),
            };

            const model: IModel = {
                assets: {
                    ordering: {
                        groupBy: "type",
                        otherGroupBys: [ "location" ],
                    },
                },
            };

            // Simulate how properties are passed to assets constructors
            const props: ICryptoWalletProperties = {
                get description() { return expected.description; },
                get location() { return expected.location; },
                get quantity() { return expected.quantity; },
                get address() { return expected.address; },
                get notes() { return expected. notes; },
            };

            sut = new ctor(model, expected);
        });

        describe("constructor", () => {
            it("should copy parameter properties", () => {
                const { description, location, quantity, address, notes } = sut;
                const actual: ICryptoWalletProperties = { description, location, quantity, address, notes };
                expect(actual).toEqual(expected);
            });
        });
    });
};

testAsset(LtcWallet);
