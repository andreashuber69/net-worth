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
import { IInputInfo } from "../model/IInputInfo";
import { ValueInputInfo } from "../model/ValueInputInfo";
import { ComponentBase } from "./ComponentBase";

/** Defines the base for all controls that simplify common functionality like e.g. validation. */
export class ControlBase<T extends ValueInputInfo> extends ComponentBase<string> {
    @Prop()
    public info?: IInputInfo;

    @Prop()
    // property should be declared as having the type keyof IAllAssetProperties but doing so triggers the following
    // issue: https://github.com/kaorun343/vue-property-decorator/issues/69
    public property: undefined;

    @Prop()
    public validator?: (info: T) => string | true;

    public get isPresent() {
        return this.checkedInfo.isPresent;
    }

    public get isRequired() {
        return this.checkedInfo.isRequired;
    }

    public get label() {
        return this.checkedInfo.label;
    }

    public get hint() {
        return this.checkedInfo.hint;
    }

    public validate(value: string) {
        const localValidationResult = this.checkedInfo.validate(value);

        return localValidationResult === true ?
            !this.validator || this.validator(this.checkedInfo) : localValidationResult;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(private readonly ctor: { new(): T }) {
        super();
    }

    protected get checkedInfo() {
        if (this.info === undefined) {
            throw new Error("No info set!");
        }

        return this.info.get(this.ctor, this.property);
    }
}
