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

/** Enumerates the weight units supported by the application. */
export enum WeightUnit {
    Gram = 1,
    Kilogram = 1000,
    Grain = 0.06479891, // https://en.wikipedia.org/wiki/Grain_(unit)
    TroyOunce = Grain * 480, // https://en.wikipedia.org/wiki/Ounce
    AvdpOunce = Grain * 437.5, // https://en.wikipedia.org/wiki/Ounce
}

/** @internal */
export class WeightUnits {
    /** @internal */
    public static toString(unit: WeightUnit) {
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

    /** @internal */
    public static toWeightUnit(str: string) {
        const result = this.unitMap.get(str);

        if (!result) {
            throw new Error("Unknown WeightUnit string!");
        }

        return result;
    }

    /** @internal */
    public static getAllStrings() {
        return this.unitMap.keys();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly unitMap = new Map<string, WeightUnit>(WeightUnits.getMapEntries());

    private static * getMapEntries(): IterableIterator<[string, WeightUnit]> {
        for (const weightUnitProperty in WeightUnit) {
            if (Number.parseFloat(weightUnitProperty)) {
                const weightUnit = Number.parseFloat(weightUnitProperty) as WeightUnit;
                yield [ WeightUnits.toString(weightUnit), weightUnit ];
            }
        }
    }
}
