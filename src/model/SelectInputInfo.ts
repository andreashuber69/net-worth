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

/* eslint-disable max-classes-per-file */
import { IPrimitiveInputInfoProperties, PrimitiveInputInfo } from "./PrimitiveInputInfo";
import { EnumSchemaName, SchemaName, Validator } from "./validation/Validator";

export abstract class SelectInputInfoBase extends PrimitiveInputInfo {
    public abstract get items(): readonly string[];

    /** @internal */
    protected constructor(props: IPrimitiveInputInfoProperties) {
        super(props);
    }
}

interface ISelectInputInfoParameters extends IPrimitiveInputInfoProperties {
    readonly items: readonly string[];
    readonly enumSchemaNames: readonly EnumSchemaName[];
}

/** Provides input information for a property where a valid value needs to be equal to one of a given list of values. */
export class SelectInputInfo extends SelectInputInfoBase {
    public readonly items: readonly string[];

    /** @internal */
    public constructor(params = SelectInputInfo.getDefaults()) {
        super(params);
        ({ items: this.items, enumSchemaNames: this.enumSchemaNames } = params);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected validateContent(strict: boolean, input: unknown) {
        if (this.items.length && this.enumSchemaNames.length) {
            const result = this.enumSchemaNames.reduce<string | true>(
                (p: string | true, c: SchemaName) => (p === true ? p : Validator.validate(input, c)),
                "",
            );

            if (result !== true) {
                return result;
            }
        }

        return super.validateContent(strict, input);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getDefaults(): ISelectInputInfoParameters {
        return { label: "", hint: "", isPresent: false, isRequired: false, items: [], enumSchemaNames: [] };
    }

    private readonly enumSchemaNames: readonly EnumSchemaName[];
}
