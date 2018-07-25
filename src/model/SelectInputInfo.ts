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

import { PrimitiveInputInfo } from "./PrimitiveInputInfo";
import { Unknown, Value } from "./Value";

type Enum<E> = Record<keyof E, number> & { [key: number]: string };

export abstract class SelectInputInfoBase extends PrimitiveInputInfo {
    public abstract get items(): string[];

    /** @internal */
    protected constructor(label = "", hint = "", isPresent = false, isRequired = false) {
        super(label, hint, isPresent, isRequired);
    }
}

/** Provides input information for a property where a valid value needs to be equal to one of a given list of values. */
// tslint:disable-next-line:max-classes-per-file
export class SelectInputInfo<T extends Enum<T>> extends SelectInputInfoBase {
    /** @internal */
    public constructor(
        label = "", hint = "", isPresent = false, isRequired = false, private readonly enumType?: T) {
        super(label, hint, isPresent, isRequired);
    }

    public get items() {
        const result = new Array<string>();

        if (this.enumType) {
            for (const value in this.enumType) {
                if (Number.isNaN(Number.parseFloat(value))) {
                    result.push(value);
                }
            }
        }

        return result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected validateContent(strict: boolean, input: Unknown) {
        if (this.enumType) {
            if (!(input in this.enumType)) {
                return Value.getUnknownValue(input);
            }
        }

        return super.validateContent(strict, input);
    }
}