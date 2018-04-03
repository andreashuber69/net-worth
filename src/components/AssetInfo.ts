// Copyright (C) 2018 Andreas Huber Dönni
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

// // enum Currency {
// //     BTC,
// //     USD,
// // }

// // interface IUpdateResult {
// //     readonly quantity: number;
// //     readonly quantitytUnit: string; // "g" when a weight should be represented, no special meaning for anything.
// //     readonly value: number;
// //     readonly valueCurrency: Currency;
// // }

export abstract class AssetInfo {
    public amount = Number.NaN;
    public value = Number.NaN;

    public constructor(
        public readonly location: string,
        public readonly label: string,
        public readonly type: string,
        private readonly amountDecimals: number,
        private readonly amountDenomination: string) {
    }

    public get shortLocation() {
        const maxLength = 15;

        return this.location.length > maxLength ? `${this.location.substr(0, maxLength)}...` : this.location;
    }

    public get formattedAmount() {
        return Number.isNaN(this.amount) ? "" :
            `${this.amount.toFixed(this.amountDecimals)} ${this.amountDenomination}`;
    }

    public abstract update(): Promise<void>;
}
