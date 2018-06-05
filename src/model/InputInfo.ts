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

import { AllAssetPropertyNames } from "./AssetInterfaces";
import { PrimitiveInputInfo } from "./PrimitiveInputInfo";
import { CompositeValue, PrimitiveValue, Value, ValueUtility } from "./Value";

/**
 * Defines the base for all classes that provide input information for a primitive or composite value.
 * @description Input information refers to data displayed in the UI (prompts, hints, whether a value is required, etc.)
 * as well as the means to validate input.
 */
export abstract class InputInfo {
    /**
     * Validates `value` or a property of `value`.
     * @description As the type indicates, `value` can be of primitive or composite type. In the former case, `value`
     * itself is validated. In the latter case, the value of the property with the passed name is validated. Either
     * way, this method only ever validates a single primitive value.
     * @returns `true` if the property value is valid; otherwise a string describing why the value is invalid.
     */
    public validate(value: Value, propertyName?: AllAssetPropertyNames) {
        if (ValueUtility.isComposite(value)) {
            if (propertyName === undefined) {
                throw new Error("The propertyName argument cannot be undefined for a composite value.");
            }

            return this.validateComposite(value, propertyName);
        } else {
            if (propertyName !== undefined) {
                throw new Error("The propertyName argument must be undefined for a primitive value.");
            }

            return this.validatePrimitive(value);
        }
    }

    /**
     * Gets the [[SimpleInputInfo]] subclass object for a property.
     * @description When implemented by [[SimpleInputInfo]], this method simply returns `this`.
     * @throws `Error` if `T` does not match the type implied by `propertyName`.
     */
    public abstract get<T extends PrimitiveInputInfo>(ctor: { new(): T }, propertyName?: AllAssetPropertyNames): T;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:prefer-function-over-method
    protected validatePrimitive(value: PrimitiveValue): true | string {
        throw new Error("A primitive value was provided when a composite one was expected.");
    }

    // tslint:disable-next-line:prefer-function-over-method
    protected validateComposite(value: CompositeValue, propertyName: AllAssetPropertyNames): true | string {
        throw new Error("A composite value was provided when a primitive one was expected.");
    }
}
