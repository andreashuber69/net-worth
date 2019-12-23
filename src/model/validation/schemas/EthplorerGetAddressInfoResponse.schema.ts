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

export interface IToken {
    readonly tokenInfo: {
        readonly symbol: string;
        readonly decimals: string | number;
        readonly price: false | {
            readonly rate: number;
            readonly currency: "USD";
            readonly [key: string]: unknown;
        };
        readonly [key: string]: unknown;
    };

    readonly balance: number;
    readonly [key: string]: unknown;
}

export class EthplorerGetAddressInfoResponse {
    public readonly ETH!: {
        balance: number;
    };

    public readonly tokens?: readonly IToken[];
    readonly [key: string]: unknown;
}
