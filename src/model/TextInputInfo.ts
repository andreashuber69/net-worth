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

import { IPrimitiveInputInfoProperties, PrimitiveInputInfo } from "./PrimitiveInputInfo";
import { SchemaName, Validator } from "./validation/Validator";

interface ITextInputInfoProperties extends IPrimitiveInputInfoProperties {
    readonly schemaName?: SchemaName;
}

/**
 * Provides input information for a property where a valid value either needs to be a number with certain constraints
 * (minimum, maximum, step) or text.
 */
export class TextInputInfo extends PrimitiveInputInfo {
    public get min() {
        return this.getValue("minimum");
    }

    public get max() {
        return this.getValue("maximum");
    }

    public get step() {
        return this.getValue("multipleOf");
    }

    /** @internal */
    public constructor(props: ITextInputInfoProperties = { label: "", hint: "", isPresent: false, isRequired: false }) {
        super(props);
        ({ schemaName: this.schemaName } = props);
    }

    public get type() {
        return this.isNumber ? "number" : "text";
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @internal
     * @description This duplicates the validation a HTML input control (or a v-text-field) does out of the box. The
     * duplication is necessary for the following reasons:
     * - Some browsers localize the validation message. Since this application is in English only, users with a
     *   non-English locale would get mixed languages in the UI.
     * - We want to use exactly the same rules to validate file content.
     */
    protected validateContent(strict: boolean, input: unknown) {
        const valueResult = this.validateValue(strict, input);

        if (valueResult !== true) {
            return valueResult;
        }

        return super.validateContent(strict, input);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly schemaName?: SchemaName;

    private get isNumber() {
        return (this.min !== undefined) || (this.max !== undefined) || (this.step !== undefined);
    }

    private getValue(propertyName: string) {
        if (this.schemaName) {
            // tslint:disable-next-line: no-unsafe-any
            const result = (Validator.getSchema(this.schemaName) as { [propertyName: string]: unknown })[propertyName];

            return typeof result === "number" ? result : undefined;
        } else {
            return undefined;
        }
    }

    private validateValue(strict: boolean, input: unknown) {
        if (!this.schemaName) {
            throw new Error("Missing schemaName.");
        }

        return Validator.validate(
            !strict && this.isNumber && (typeof input === "string") ? Number.parseFloat(input) : input,
            this.schemaName);
    }
}
