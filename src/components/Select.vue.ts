// https://github.com/andreashuber69/net-worth#--
import { Component, Prop } from "vue-property-decorator";

import type { SelectInputInfoBase } from "../model/SelectInputInfo";
import { SelectInputInfo } from "../model/SelectInputInfo";

import { ControlBase } from "./ControlBase";

@Component
/** Implements a select control that simplifies common functionality like validation. */
// eslint-disable-next-line import/no-default-export
export default class Select extends ControlBase<SelectInputInfoBase> {
    @Prop()
    public large?: boolean;

    public get items() {
        return this.primitiveInputInfo.items;
    }

    /**
     * @description This redundant method is only necessary because a method called from a template apparently needs to
     * be a member of the class associated with the template.
     */
    public validate() {
        return super.validate();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected get primitiveInputInfo(): SelectInputInfoBase {
        return this.checkedInfo.get(SelectInputInfo, this.property);
    }
}
