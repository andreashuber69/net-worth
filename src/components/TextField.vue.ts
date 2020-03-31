// https://github.com/andreashuber69/net-worth#--
import { Component, Prop } from "vue-property-decorator";

import { TextInputInfo } from "../model/TextInputInfo";

import { ControlBase } from "./ControlBase";

@Component
/** Implements a text field control that simplifies common functionality like validation. */
// eslint-disable-next-line import/no-default-export
export default class TextField extends ControlBase<TextInputInfo> {
    @Prop()
    public large?: boolean;

    public get type() {
        return this.primitiveInputInfo.type;
    }

    public get min() {
        return this.primitiveInputInfo.min;
    }

    public get max() {
        return this.primitiveInputInfo.max;
    }

    public get step() {
        return this.primitiveInputInfo.step;
    }

    /**
     * @description This redundant method is only necessary because a method called from a template apparently needs to
     * be a member of the class associated with the template.
     */
    public validate() {
        return super.validate();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected get primitiveInputInfo(): TextInputInfo {
        return this.checkedInfo.get(TextInputInfo, this.property);
    }
}
