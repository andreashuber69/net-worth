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
import { IAuxProperties } from "./IAuxProperties";
import { SimpleInputInfo } from "./SimpleInputInfo";
import { Value } from "./Value";

/**
 * Defines the base for all classes that provide input information for a simple or composite value.
 * @description Input information refers to data displayed in the UI (prompts, hints, whether a value is required, etc.)
 * as well as the means to validate input.
 */
export abstract class InputInfo {
    /**
     * Gets the [[SimpleInputInfo]] subclass object for a property.
     * @description When implemented by [[SimpleInputInfo]], this method simply returns `this`.
     * @throws `Error` if `T` does not match the type implied by `propertyName`.
     */
    public abstract get<T extends SimpleInputInfo>(ctor: { new(): T }, propertyName?: AllAssetPropertyNames): T;

    /**
     * Validates `value`.
     * @returns `true` if the property value is valid; otherwise a string describing why the value is invalid.
     */
    public validate(value: IAuxProperties<string> | string, propertyName?: AllAssetPropertyNames) {
        if (Value.isComposite(value)) {
            if (propertyName === undefined) {
                throw new Error("The propertyName argument cannot be undefined for a composite value.");
            }

            return this.validateComposite(value, propertyName);
        } else {
            if (propertyName !== undefined) {
                throw new Error("The propertyName argument must be undefined for a simple value.");
            }

            return this.validateSimple(value);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:prefer-function-over-method
    protected validateSimple(value: string): true | string {
        throw new Error("A simple value was provided when a composite one was expected.");
    }

    // tslint:disable-next-line:prefer-function-over-method
    protected validateComposite(value: IAuxProperties<string>, propertyName: AllAssetPropertyNames): true | string {
        throw new Error("A composite value was provided when a simple one was expected.");
    }
}
