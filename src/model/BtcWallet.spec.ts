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
import { BtcWallet } from "./BtcWallet";
import { ICryptoWalletProperties } from "./ICryptoWallet";

const testQueryData = <T extends Asset>(
    ctor: new(model: IModel, props: ICryptoWalletProperties) => T, address: string) => {
    describe(ctor.name, () => {
        const model: IModel = {
            assets: {
                ordering: {
                    groupBy: "type",
                    otherGroupBys: [ "location" ],
                },
            },
        };

        describe("queryData", () => {
            it(`should query the balance of ${address}`, async () => {
                const sut = new ctor(model, { description: "Spending", address });

                expect(sut.quantity).toBeUndefined();
                expect(await sut.queryData()).toBeUndefined();
                expect(sut.quantity).toBeDefined();
            });
        });
    });
};

// tslint:disable-next-line: max-line-length
testQueryData(BtcWallet, "xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz");
testQueryData(BtcWallet, "1MyMTPFeFWuPKtVa7W9Lc2wDi7ZNm6kN4a");
