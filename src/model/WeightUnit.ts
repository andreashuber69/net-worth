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

export enum WeightUnit {
    Gram = 1,
    Kilogram = 1000,
    Grain = 0.06479891, // https://en.wikipedia.org/wiki/Grain_(unit)
    TroyOunce = Grain * 480, // https://en.wikipedia.org/wiki/Ounce
    AvdpOunce = Grain * 437.5, // https://en.wikipedia.org/wiki/Ounce
}

export class Weight {
    public static abbreviate(unit: WeightUnit) {
        switch (unit) {
            case WeightUnit.Gram:
                return "g";
            case WeightUnit.Kilogram:
                return "kg";
            case WeightUnit.Grain:
                return "gr";
            case WeightUnit.TroyOunce:
                return "t oz";
            case WeightUnit.AvdpOunce:
                return "oz";
            default:
                throw new Error("Unknown WeightUnit!");
        }
    }
}
