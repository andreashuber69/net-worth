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

import { Component } from "vue-property-decorator";
import { Asset } from "./Asset";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

// tslint:disable-next-line:no-unsafe-any
@Component
// tslint:disable-next-line:no-default-export
export default class AssetListRow extends ComponentBase<Asset> {
    public get shortLocation() {
        const maxLength = 15;

        return this.model.location.length > maxLength ?
            `${this.model.location.substr(0, maxLength)}...` : this.model.location;
    }

    public get finenessInteger() {
        return this.model.fineness === 1 ? "" : Math.trunc(this.model.fineness);
    }

    public get finenessFraction() {
        if (this.model.fineness === 1) {
            return "";
        } else {
            let fraction = (this.model.fineness % 1).toFixed(6).substr(1);

            while (fraction.endsWith("0")) {
                fraction = fraction.substr(0, fraction.length - 1);
            }

            return fraction;
        }
    }

    public get unitValueInteger() {
        return Format.integer(this.model.unitValue, 2);
    }

    public get unitValueFraction() {
        return Format.fraction(this.model.unitValue, 2);
    }

    public get quantityInteger() {
        return Format.integer(this.model.quantity, this.model.quantityDecimals);
    }

    public get quantityFraction() {
        return Format.fraction(this.model.quantity, this.model.quantityDecimals);
    }

    public get totalValueInteger() {
        return Format.integer(this.model.totalValue, 2);
    }

    public get totalValueFraction() {
        return Format.fraction(this.model.totalValue, 2);
    }
}
