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

import { Unknown } from "./Unknown";
import { Value } from "./Value";

/** Provides error messages for parse failures. */
export class ParseErrorMessage {
    /** @internal */
    public static getPropertyTypeMismatch(
        propertyName: string, actual: Unknown | null | undefined, ...expected: Array<Unknown | null | undefined>) {
        if (Value.isObject(actual)) {
            return this.addPropertyName(propertyName, this.getTypeMismatch(actual[propertyName], ...expected));
        } else {
            return this.getTypeMismatch(actual, {});
        }
    }

    /** @internal */
    public static getTypeMismatch(
        actual: Unknown | null | undefined, ...expected: Array<Unknown | null | undefined>) {
        const actualType = this.getTypeName(actual);
        const expectedTypes = expected.reduce<string>(
            (p, c) => p === "" ? this.getTypeName(c) : `${p} or ${this.getTypeName(c)}`, "");

        return `The type of the value (${actualType}) does not match the expected type(s) ${expectedTypes}.`;
    }

    /** @internal */
    public static getUnknownPropertyValue(propertyName: string, value: Unknown | null | undefined) {
        return this.addPropertyName(propertyName, this.getUnknownValue(value));
    }

    /** @internal */
    public static getUnknownValue(value: Unknown | null | undefined) {
        return `The value '${typeof value === "symbol" ? "symbol" : value}' does not match any of the possible values.`;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static addPropertyName(propertyName: string, rest: string) {
        return `'${propertyName}': ${rest}`;
    }

    private static getTypeName(value: any) {
        if (value === null) {
            return "null";
        }

        const type = typeof value;

        return type === "object" ? (Array.isArray(value) ? "Array" : "Object") : type;
    }
}
