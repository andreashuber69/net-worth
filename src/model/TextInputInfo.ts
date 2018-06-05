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
import { RequiredPrimitiveValue } from "./Value";

/**
 * Provides input information for a property where a valid value either needs to be a number with certain constraints
 * (minimum, maximum, step) or text.
 */
export class TextInputInfo extends PrimitiveInputInfo {
    /** @internal */
    public constructor(
        label = "", hint = "", isPresent = false, isRequired = false,
        public readonly min?: number, public readonly max?: number, public step?: number) {
        super(label, hint, isPresent, isRequired);
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
    protected validateContent(value: RequiredPrimitiveValue) {
        if (this.isNumber) {
            const numericValue = TextInputInfo.convertToNumeric(value);

            if ((this.min !== undefined) && (this.min - numericValue > Number.EPSILON)) {
                return `Value must be greater than or equal to ${TextInputInfo.format(this.min)}.`;
            }

            if ((this.max !== undefined) && (numericValue - this.max > Number.EPSILON)) {
                return `Value must be less than or equal to ${TextInputInfo.format(this.max)}.`;
            }

            const bottom = this.min !== undefined ? this.min : 0;
            const step = this.step !== undefined ? this.step : 1;
            const lower = Math.floor((numericValue - bottom) / step) * step + bottom;
            const upper = lower + step;
            // The calculations for the conditions below each involve at most 6 operations, each of which might produce
            // a result that could be wrong by at most Number.EPSILON.
            const maxError = TextInputInfo.getMaxError(upper, 6);

            if ((numericValue - lower > maxError) && (upper - numericValue > maxError)) {
                const lowerText = TextInputInfo.format(lower, 4);
                const upperText = TextInputInfo.format(upper, 5);

                return `Please enter a valid value. The two nearest valid values are ${lowerText} and ${upperText}.`;
            }
        }

        return super.validateContent(value);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private get isNumber() {
        return (this.min !== undefined) || (this.max !== undefined) || (this.step !== undefined);
    }

    private static convertToNumeric(value: boolean | number | string) {
        // This should rather be a switch statement but it appears that the current TypeScript compiler is unable to
        // reason about types in switch-case statements: https://github.com/Microsoft/TypeScript/issues/2214.
        if (typeof value === "string") {
            return Number.parseFloat(value);
        } else if (typeof value === "number") {
            return value;
        } else {
            return value ? 1 : 0;
        }
    }

    private static format(value: number, epsilonFactor: number = 1) {
        return value.toLocaleString(
            undefined, { maximumFractionDigits: Math.floor(-Math.log10(this.getMaxError(value, epsilonFactor))) });
    }

    private static getMaxError(value: number, epsilonFactor: number = 1) {
        return Math.max(Math.abs(value) * epsilonFactor, 1) * Number.EPSILON;
    }
}
