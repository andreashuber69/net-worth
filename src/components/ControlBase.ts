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
import { AssetPropertyName } from "../model/AssetInterfaces";
import { IAuxProperties } from "../model/IAuxProperties";
import { InputUtility } from "../model/Input";
import { InputInfo } from "../model/InputInfo";
import { PrimitiveInputInfo } from "../model/PrimitiveInputInfo";
import { ComponentBase } from "./ComponentBase";

/** Defines the base for all controls that simplify common functionality like e.g. validation. */
export abstract class ControlBase<T extends PrimitiveInputInfo> extends ComponentBase<IAuxProperties<string> | string> {
    @Prop()
    public info?: InputInfo;

    @Prop()
    // property should be declared as having the type AllAssetPropertyNames but doing so triggers the following issue:
    // https://github.com/kaorun343/vue-property-decorator/issues/69
    public property: undefined;

    public get isPresent() {
        return this.primitiveInputInfo.isPresent;
    }

    public get isRequired() {
        return this.primitiveInputInfo.isRequired;
    }

    public get label() {
        return this.primitiveInputInfo.label;
    }

    public get hint() {
        return this.primitiveInputInfo.hint;
    }

    public get propertyValue() {
        return InputUtility.isComposite(this.checkedValue) ?
            this.checkedValue[this.checkedProperty] : this.checkedValue;
    }

    public set propertyValue(value: string) {
        if (InputUtility.isComposite(this.checkedValue)) {
            this.checkedValue[this.checkedProperty] = value;
        } else {
            this.checkedValue = value;
        }
    }

    public validate() {
        return this.checkedInfo.validate(false, this.checkedValue, this.property);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected abstract get primitiveInputInfo(): T;

    protected get checkedInfo() {
        if (this.info === undefined) {
            throw new Error("No info set!");
        }

        return this.info;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private get checkedProperty() {
        if (this.property as any === undefined) {
            throw new Error("No property set!");
        }

        return this.property as any as AssetPropertyName;
    }
}
