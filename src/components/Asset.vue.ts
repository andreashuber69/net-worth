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

import { Component, Prop, Vue } from "vue-property-decorator";
import { AssetInfo } from "./AssetInfo";

// tslint:disable-next-line:no-unsafe-any
@Component
// tslint:disable-next-line:no-default-export no-unsafe-any
export default class Asset extends Vue {
    @Prop()
    public asset?: AssetInfo;

    public get shortLocation() {
        const maxLength = 15;

        return this.info.location.length > maxLength ?
            `${this.info.location.substr(0, maxLength)}...` : this.info.location;
    }

    public get finenessInteger() {
        return this.info.fineness === 1 ? "" : Math.trunc(this.info.fineness);
    }

    public get finenessFraction() {
        if (this.info.fineness === 1) {
            return "";
        } else {
            let fraction = (this.info.fineness % 1).toFixed(6).substr(1);

            while (fraction.endsWith("0")) {
                fraction = fraction.substr(0, fraction.length - 1);
            }

            return fraction;
        }
    }

    public get unitValueInteger() {
        return AssetInfo.formatInteger(this.info.unitValue);
    }

    public get unitValueFraction() {
        return AssetInfo.formatFraction(this.info.unitValue, 2);
    }

    public get quantityInteger() {
        return AssetInfo.formatInteger(this.info.quantity);
    }

    public get quantityFraction() {
        return AssetInfo.formatFraction(this.info.quantity, this.info.quantityDecimals);
    }

    public get totalValueInteger() {
        return AssetInfo.formatInteger(this.info.totalValue);
    }

    public get totalValueFraction() {
        return AssetInfo.formatFraction(this.info.totalValue, 2);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private get info() {
        if (!this.asset) {
            throw new Error("No asset set.");
        }

        return this.asset;
    }
}
