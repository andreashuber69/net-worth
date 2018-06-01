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

import { IAuxProperties } from "./IAuxProperties";
import { IInputInfo } from "./IInputInfo";
import { IValidator } from "./IValidator";

/** Defines the base for all classes that provide input information for the value of a property. */
export abstract class ValueInputInfo implements IValidator<number | string | undefined | null>, IInputInfo {
    public validate(value: number | string | undefined | null) {
        if (!this.isPresent) {
            return true;
        }

        if ((value === undefined) || (value === null) || (value === "")) {
            return this.isRequired ? "Please fill out this field." : true;
        }

        return this.validateImpl(value);
    }

    public get<T extends ValueInputInfo>(ctor: { new(): T }, property?: keyof IAuxProperties<ValueInputInfo>): T {
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
    }

    /** @internal */
    protected abstract validateImpl(value: number | string): true | string;
}
