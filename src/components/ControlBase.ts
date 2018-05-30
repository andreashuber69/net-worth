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

import { Prop } from "vue-property-decorator";
import { ValueInputInfo } from "../model/ValueInputInfo";
import { ComponentBase } from "./ComponentBase";

/** Defines the base for all controls that simplify common functionality like e.g. validation. */
export class ControlBase<T extends ValueInputInfo> extends ComponentBase<string> {
    @Prop()
    public inputInfo?: T;

    @Prop()
    public validator?: (inputInfo: T) => string | true;

    public get checkedInfo() {
        if (this.inputInfo === undefined) {
            throw new Error("No info set!");
        }

        return this.inputInfo;
    }

    public validate(value: string) {
        const localValidationResult = this.checkedInfo.validate(value);

        if (localValidationResult !== true) {
            return localValidationResult;
        }

        return !this.validator || this.validator(this.checkedInfo);
    }
}
