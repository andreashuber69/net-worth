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
import { AllAssetPropertyNames } from "../model/AssetInterfaces";
import { IAuxProperties } from "../model/IAuxProperties";
import { InputInfo } from "../model/InputInfo";
import { PrimitiveInputInfo } from "../model/PrimitiveInputInfo";
import { ValueUtility } from "../model/Value";
import { ComponentBase } from "./ComponentBase";

/** Defines the base for all controls that simplify common functionality like e.g. validation. */
export class ControlBase<T extends PrimitiveInputInfo> extends ComponentBase<IAuxProperties<string> | string> {
    @Prop()
    public info?: InputInfo;

    @Prop()
    // property should be declared as having the type AllAssetPropertyNames but doing so triggers the following issue:
    // https://github.com/kaorun343/vue-property-decorator/issues/69
    public property: undefined;

    public get isPresent() {
        return this.valueInputInfo.isPresent;
    }

    public get isRequired() {
        return this.valueInputInfo.isRequired;
    }

    public get label() {
        return this.valueInputInfo.label;
    }

    public get hint() {
        return this.valueInputInfo.hint;
    }

    public get propertyValue() {
        return ValueUtility.isComposite(this.checkedValue) ?
            this.checkedValue[this.property as any as AllAssetPropertyNames] : this.checkedValue;
    }

    public set propertyValue(value: string) {
        if (ValueUtility.isComposite(this.checkedValue)) {
            this.checkedValue[this.property as any as AllAssetPropertyNames] = value;
        } else {
            this.checkedValue = value;
        }
    }

    public validate() {
        return this.checkedInfo.validate(this.checkedValue, this.property);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(private readonly ctor: { new(): T }) {
        super();
    }

    protected get valueInputInfo() {
        return this.checkedInfo.get(this.ctor, this.property);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private get checkedInfo() {
        if (this.info === undefined) {
            throw new Error("No info set!");
        }

        return this.info;
    }
}
