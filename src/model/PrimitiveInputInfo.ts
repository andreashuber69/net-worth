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
import { InputInfo } from "./InputInfo";

/** Defines the base for all classes that provide input information for a primitive value. */
export abstract class PrimitiveInputInfo extends InputInfo {
    public get<T extends PrimitiveInputInfo>(ctor: { new(): T }, propertyName?: AllAssetPropertyNames): T {
        if (propertyName !== undefined) {
            throw new Error("The propertyName argument must be undefined for a primitive input.");
        }

        if (!(this instanceof ctor)) {
            throw new Error(`The requested type ${ctor.name} does not match the actual type.`);
        }

        return this;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @internal */
    protected constructor(
        public readonly label: string, public readonly hint: string,
        public readonly isPresent: boolean, public readonly isRequired: boolean) {
        super();
    }

    /** @internal */
    // TODO: The parameter type should be a type definition rather than explicitly spelled out here, but somehow the
    // typescript compiler then seems to conclude that the (typeof value === "string") below is always false...
    protected validatePrimitive(value: {} | undefined |  null) {
        if (!this.isPresent) {
            return true;
        }

        if ((value === undefined) || (value === null) || ((typeof value === "string") && (value.length === 0))) {
            return this.isRequired ? "Please fill out this field." : true;
        }

        return this.validateContent(value);
    }

    /** @internal */
    // tslint:disable-next-line:prefer-function-over-method
    protected validateContent(value: {}): true | string {
        return true;
    }
}
