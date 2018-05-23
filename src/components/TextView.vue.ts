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

import { Component, Prop } from "vue-property-decorator";
import { ComponentBase } from "./ComponentBase";
import { PropertyInfo } from "./PropertyInfo";

// tslint:disable-next-line:no-unsafe-any
@Component
/** Implements a text view */
// tslint:disable-next-line:no-default-export
export default class TextView extends ComponentBase<string> {
    @Prop()
    public propertyInfo?: PropertyInfo;

    // tslint:disable-next-line:no-unsafe-any
    @Prop()
    public value?: string;

    public get checkedValue() {
        if (this.value === undefined) {
            throw new Error("No value set!");
        }

        return this.value;
    }

    public set checkedValue(value: string) {
        // tslint:disable-next-line:no-unsafe-any
        this.$emit("input", value);
    }

    public get checkedInfo() {
        if (this.propertyInfo === undefined) {
            throw new Error("No info set!");
        }

        return this.propertyInfo;
    }
}
