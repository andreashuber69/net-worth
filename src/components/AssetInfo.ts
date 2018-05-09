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

export class AssetInfo {
    public constructor(
        public readonly type: string,
        public readonly hasDescription: boolean,
        public readonly hasLocation: boolean,
        public readonly hasWeightUnit: boolean,
        public readonly hasWeight: boolean,
        public readonly hasFineness: boolean,
        public readonly hasQuantity: boolean,
        public readonly quantityDecimals: number,
    ) {
    }

    public get quantityStep() {
        return Math.pow(10, -this.quantityDecimals);
    }
}
