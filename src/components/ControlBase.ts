// https://github.com/andreashuber69/net-worth#--
import { Prop } from "vue-property-decorator";

import type { AssetPropertyName } from "../model/AssetInterfaces";
import type { IAuxProperties } from "../model/IAuxProperties";
import { InputUtility } from "../model/Input";
import type { InputInfo } from "../model/InputInfo";
import type { PrimitiveInputInfo } from "../model/PrimitiveInputInfo";

import { ComponentBase } from "./ComponentBase";

/** Defines the base for all controls that simplify common functionality like validation. */
export abstract class ControlBase<T extends PrimitiveInputInfo> extends ComponentBase<IAuxProperties<string> | string> {
    @Prop()
    public info?: InputInfo;

    @Prop()
    public property?: AssetPropertyName;

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
            this.checkedValue[this.checkedProperty] :
            this.checkedValue;
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
        if (this.property === undefined) {
            throw new Error("No property set!");
        }

        return this.property;
    }
}
