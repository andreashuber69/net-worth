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

import { Prop, Vue } from "vue-property-decorator";
import { ComponentBase } from "./ComponentBase";
import { ValueInputInfo } from "./ValueInputInfo";

/** Provides the base for all controls that simplify common functionality like e.g. validation. */
export class ControlBase<T extends ValueInputInfo> extends ComponentBase<string> {
    @Prop()
    public inputInfo?: T;

    @Prop()
    public validator?: (inputInfo: T, control: Vue) => string | true;

    public get checkedInfo() {
        if (this.inputInfo === undefined) {
            throw new Error("No info set!");
        }

        return this.inputInfo;
    }

    public validate() {
        const control = this.getControl("control");

        return !this.validator || !control || this.validator(this.checkedInfo, control);
    }
}
