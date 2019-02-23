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

describe("LtcWallet", () => {
    let sut: LtcWallet;

    beforeEach(() => {
        const model: IModel = {
            assets: {
                ordering: {
                    groupBy: "type",
                    otherGroupBys: [ "location" ],
                },
            },
        };

        const props: ICryptoWalletProperties = {
            description: "Paper Wallet",
        };

        sut = new LtcWallet(model, props);
    });

    describe("constructor", () => {
        it("should copy parameter properties", () => {
            const { description } = sut;
            expect(description).toBe("Paper Wallet");
        });
    });
});
