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
import { QuandlParser } from "./QuandlParser";

export enum WeigthUnit {
    Gram = 1,
    Kilogram = 1000,
    Grain = 0.06479891, // https://en.wikipedia.org/wiki/Grain_(unit)
    TroyOunce = Grain * 480, // https://en.wikipedia.org/wiki/Ounce
    AvdpOunce = Grain * 437.5, // https://en.wikipedia.org/wiki/Ounce
}

/** Provides information about an asset made of a precious metal. */
export abstract class PreciousMetalInfo extends AssetInfo {
    public get finenessInteger() {
        return Math.trunc(this.fineness);
    }

    public get finenessFraction() {
        let fraction = (this.fineness % 1).toFixed(6).substr(1);

        while (fraction.endsWith("0")) {
            fraction = fraction.substr(0, fraction.length - 1);
        }

        return fraction;
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
        weightUnit: WeigthUnit,
        weight: number,
        public readonly fineness: number,
        quantity: number,
        private readonly quandlId: string,
    ) {
        super(location, description, type, PreciousMetalInfo.getUnit(weightUnit, weight), quantity, 0);
        this.pureGramsPerUnit = weightUnit * weight * fineness;
    }

    // tslint:disable-next-line:prefer-function-over-method
    protected * getQueries() {
        yield `https://www.quandl.com/api/v3/datasets/lbma/${this.quandlId}.json?api_key=ALxMkuJx2XTUqsnsn6qK&rows=1`;
    }

    protected processQueryResponse(response: any) {
        this.unitValueUsd = this.pureGramsPerUnit / WeigthUnit.TroyOunce * QuandlParser.getPrice(response);

        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getUnit(unit: WeigthUnit, weight: number) {
        return `${weight.toFixed(0)} ${this.abbreviate(unit)}`;
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

    private readonly pureGramsPerUnit: number;
}
