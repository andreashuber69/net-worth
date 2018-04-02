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

export class PreciousMetalInfo extends AssetInfo {
    public constructor(
        key: number,
        label: string,
        type: string,
        location: string,
        denomination: string,
        amount: number) {
        super(key, label, type, location, denomination);
        this.amount = amount;
    }

    public async update(): Promise<void> {
        const response = await window.fetch("https://www.quandl.com/api/v1/datasets/LBMA/GOLD.json?rows=1");
        const parsed = JSON.parse(await response.text());

        if (PreciousMetalInfo.hasDataArrayTuple(parsed)) {
            if (this.amount) {
                this.value = this.amount * parsed.data[0][1];
            }
        }
    }

    private static isObject(value: any): value is object {
        return value instanceof Object;
    }

    private static hasStringIndexer(value: any): value is { [key: string]: any } {
        return this.isObject(value);
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
}
