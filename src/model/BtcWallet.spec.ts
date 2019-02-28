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
import { BtcWallet } from "./BtcWallet";

describe("BtcWallet", () => {
    const model: IModel = {
        assets: {
            ordering: {
                groupBy: "type",
                otherGroupBys: [ "location" ],
            },
        },
    };

    describe("queryData", () => {
        // cSpell: ignore xpub
        it("should query the quantity of an xpub address", async () => {
            const sut = new BtcWallet(model, {
                description: "Spending",
                // tslint:disable-next-line: max-line-length
                address: "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz",
            });

            expect(sut.quantity).toBeUndefined();
            expect(await sut.queryData()).toBeUndefined();
            expect(sut.quantity).toBeDefined();
        });

        it("should query the quantity of a legacy address", async () => {
            const sut = new BtcWallet(model, {
                description: "Spending",
                address: "1MyMTPFeFWuPKtVa7W9Lc2wDi7ZNm6kN4a",
            });

            expect(sut.quantity).toBeUndefined();
            expect(await sut.queryData()).toBeUndefined();
            expect(sut.quantity).toBeDefined();
        });
    });
});
