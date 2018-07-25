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

import { AssetPropertyName } from "./AssetInterfaces";
import { InputInfo } from "./InputInfo";
import { Unknown, Value } from "./Value";

/** Defines the base for all classes that provide input information for a primitive value. */
export abstract class PrimitiveInputInfo extends InputInfo {
    public get<T extends PrimitiveInputInfo>(ctor: { new(): T }, propertyName?: AssetPropertyName): T {
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
    protected validatePrimitive(strict: boolean, input: Unknown | undefined | null, propertyName?: AssetPropertyName) {
        if (propertyName !== undefined) {
            throw new Error("The propertyName argument must be undefined for a primitive value.");
        }

        if (!this.isPresent) {
            return true;
        }

        if ((input === undefined) || (input === null) || (Value.isString(input) && (input.length === 0))) {
            return this.isRequired ? "A value is required." : true;
        }

        return this.validateContent(strict, input);
    }

    /** @internal */
    // tslint:disable-next-line:prefer-function-over-method
    protected validateContent(strict: boolean, input: Unknown): true | string {
        return true;
    }
}