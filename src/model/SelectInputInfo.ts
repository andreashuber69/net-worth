// Copyright (C) 2018-2019 Andreas Huber Dönni
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

import { Enum, EnumInfo } from "./EnumInfo";
import { IPrimitiveInputInfoProperties, PrimitiveInputInfo } from "./PrimitiveInputInfo";
import { Unknown } from "./Unknown";
import { EnumSchemaName, SchemaName, Validator } from "./validation/Validator";

export abstract class SelectInputInfoBase extends PrimitiveInputInfo {
    public abstract get items(): string[];

    /** @internal */
    protected constructor(props: IPrimitiveInputInfoProperties) {
        super(props);
    }
}

interface ISelectInputInfoParameters<T extends Enum<T>> extends IPrimitiveInputInfoProperties {
    readonly enumType?: T;
    readonly enumSchemaNames: EnumSchemaName[];
}

/** Provides input information for a property where a valid value needs to be equal to one of a given list of values. */
// tslint:disable-next-line:max-classes-per-file
export class SelectInputInfo<T extends Enum<T>> extends SelectInputInfoBase {
    /** @internal */
    public constructor(params: ISelectInputInfoParameters<T> =
        { label: "", hint: "", isPresent: false, isRequired: false, enumSchemaNames: [] }) {
        super(params);
        ({ enumType: this.enumType, enumSchemaNames: this.enumSchemaNames } = params);
    }

    public get items() {
        return this.enumType ? EnumInfo.getMemberNames(this.enumType) as string[] : [];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected validateContent(strict: boolean, input: Unknown) {
        if (this.enumType && this.enumSchemaNames.length) {
            const result = this.enumSchemaNames.reduce<string | true>(
                (p: string | true, c: SchemaName) => p === true ? p : Validator.validate(input, c), "");

            if (result !== true) {
                return result;
            }
        }

        return super.validateContent(strict, input);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly enumType?: T;
    private readonly enumSchemaNames: EnumSchemaName[];
}
