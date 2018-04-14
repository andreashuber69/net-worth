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

import { AssetInfo } from "./AssetInfo";
import { Value, ValueCurrency } from "./Value";

export enum WeigthUnit {
    Gram = 1,
    Kilogram = 1000,
    Grain = 0.06479891, // https://en.wikipedia.org/wiki/Grain_(unit)
    TroyOunce = Grain * 480, // https://en.wikipedia.org/wiki/Ounce
    AvdpOunce = Grain * 437.5, // https://en.wikipedia.org/wiki/Ounce
}

/** Provides information about an asset made of a precious metal. */
export abstract class PreciousMetalInfo extends AssetInfo {
    /** @internal */
    public processCurrentQueryResponse(response: string) {
        const parsed = JSON.parse(response);
        const totalOunces = this.totalGrams / WeigthUnit.TroyOunce;

        if (PreciousMetalInfo.hasDataArrayTuple(parsed)) {
            this.fiatValue = totalOunces * parsed.data[0][1];
        }

        return false;
    }

    /** @internal */
    public getValue() {
        return new Value(this.quantity, this.fiatValue, ValueCurrency.USD);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates a new [[PreciousMetalInfo]] instance.
     * @param location The location of the precious metal items, e.g. Saftey Deposit Box.
     * @param description Describes the precious metal items, e.g. Bars, Coins.
     * @param type The type of precious metal, e.g. Silver, Gold.
     * @param quantity The number of items.
     * @param weightUnit The unit used for `weight`, e.g. [[TroyOunce]].
     * @param weight The weight of a single item, expressed in `weightUnit`.
     * @param fineness The fineness, e.g. 0.999.
     */
    protected constructor(
        location: string,
        description: string,
        type: string,
        private readonly quantity: number,
        weightUnit: WeigthUnit,
        weight: number,
        public readonly fineness: number,
    ) {
        super(location, description, type, 0, PreciousMetalInfo.getQuantityUnit(weightUnit, weight));
        this.totalGrams = quantity * weightUnit * weight * fineness;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static hasStringIndexer(value: any): value is { [key: string]: any } {
        return value instanceof Object;
    }

    private static hasDataArray(value: any): value is { data: any[] } {
        return this.hasStringIndexer(value) && (value.data instanceof Array);
    }

    private static hasDataArrayArray(value: any): value is { data: any[][] } {
        return this.hasDataArray(value) && (value.data.length >= 1) && (value.data[0] instanceof Array);
    }

    private static hasDataArrayTuple(value: any): value is { data: Array<[ string, number ]> } {
        return this.hasDataArrayArray(value) && (value.data[0].length >= 2) &&
            (typeof value.data[0][0] === "string") && (typeof value.data[0][1] === "number");
    }

    private static getQuantityUnit(unit: WeigthUnit, denomination: number) {
        return `${denomination.toFixed(0)} ${this.abbreviate(unit)}`;
    }

    private static abbreviate(unit: WeigthUnit) {
        switch (unit) {
            case WeigthUnit.Gram:
                return "g";
            case WeigthUnit.Kilogram:
                return "kg";
            case WeigthUnit.Grain:
                return "gr";
            case WeigthUnit.TroyOunce:
                return "oz (troy)";
            case WeigthUnit.AvdpOunce:
                return "oz (avdp)";
            default:
                throw new Error("Unknown WeightUnit!");
        }
    }

    private readonly totalGrams: number;
    private fiatValue?: number;
}
