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
import { Asset } from "../model/Asset";
import { ComponentBase } from "./ComponentBase";
import { Format } from "./Format";

// tslint:disable-next-line:no-unsafe-any
@Component
/**
 * Implements the UI for a single row of the asset list.
 * @description Most of the members split asset properties into the integral and fractional parts. This is necessary
 * so that the UI can justify the values on the decimal point.
 */
// tslint:disable-next-line:no-default-export
export default class AssetListRow extends ComponentBase<Asset> {
    public get finenessInteger() {
        return this.checkedValue.fineness === undefined ? "" : Math.trunc(this.checkedValue.fineness);
    }

    public get finenessFraction() {
        if (this.checkedValue.fineness === undefined) {
            return "";
        } else {
            let fraction = (this.checkedValue.fineness % 1).toFixed(6).substr(1);

            while (fraction.endsWith("0")) {
                fraction = fraction.substr(0, fraction.length - 1);
            }

            return fraction;
        }
    }

    public get unitValueInteger() {
        return Format.integer(this.checkedValue.unitValue, 2);
    }

    public get unitValueFraction() {
        return Format.fraction(this.checkedValue.unitValue, 2);
    }

    public get quantityInteger() {
        return Format.integer(this.checkedValue.quantity, this.checkedValue.displayDecimals);
    }

    public get quantityFraction() {
        return Format.fraction(this.checkedValue.quantity, this.checkedValue.displayDecimals);
    }

    public get totalValueInteger() {
        return Format.integer(this.checkedValue.totalValue, 2);
    }

    public get totalValueFraction() {
        return Format.fraction(this.checkedValue.totalValue, 2);
    }

    /** Instructs the parent UI element to open the asset editor dialog with the given asset. */
    public onEditClicked(event: MouseEvent) {
        // tslint:disable-next-line:no-unsafe-any
        this.$emit("edit", this.checkedValue);
    }

    /** Instructs the parent UI element to delete the given asset from the list. */
    public onDeleteClicked(event: MouseEvent) {
        if (confirm(`Are you sure you want to delete ${this.checkedValue.type}: ${this.checkedValue.description}`)) {
            // tslint:disable-next-line:no-unsafe-any
            this.$emit("delete", this.checkedValue);
        }
    }
}
