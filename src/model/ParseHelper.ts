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

// Theoretically, parsed JSON should never contain undefined or function values, but since it's no additional effort to
// not rely on that, we don't.
// Again theoretically, ParsedValue = {} | null would be a more sensible definition as any type is
// assignable to an empty interface. However, it appears that tslint is currently unable to handle such a type
// definition correctly. More precisely, the rule strict-type-predicates often reports false positives. With the current
// definition, there are still some false positives but much fewer.
export type RequiredParsedValue =
    // tslint:disable-next-line:ban-types
    boolean | number | string | symbol | Function | null | { [key: string]: ParsedValue } | any[];

export type ParsedValue = RequiredParsedValue | undefined;

export class ParseHelper {
    /** @internal */
    public static isObject(value: ParsedValue): value is { [key: string]: ParsedValue } {
        return value instanceof Object;
    }

    /** @internal */
    public static isArray(value: ParsedValue): value is ParsedValue[] {
        return Array.isArray(value);
    }

    /** @internal */
    public static hasNumberProperty<T extends string>(
        value: ParsedValue, propertyName: T): value is { [K in T]: number } {
        // False positive
        // tslint:disable-next-line:strict-type-predicates
        return this.hasProperty(value, propertyName) && (typeof value[propertyName] === "number");
    }

    /** @internal */
    public static hasStringProperty<T extends string>(
        value: ParsedValue, propertyName: T): value is { [K in T]: string } {
        // False positive
        // tslint:disable-next-line:strict-type-predicates
        return this.hasProperty(value, propertyName) && (typeof value[propertyName] === "string");
    }

    /** @internal */
    public static hasArrayProperty<T extends string>(
        value: ParsedValue, propertyName: T): value is { [K in T]: ParsedValue[] } {
        return this.hasProperty(value, propertyName) && this.isArray(value[propertyName]);
    }

    /** @internal */
    public static hasObjectProperty<T extends string>(
        value: ParsedValue, propertyName: T): value is { [K in T]: ParsedValue } {
        return this.hasProperty(value, propertyName) && this.isObject(value[propertyName]);
    }

    /** @internal */
    public static getPropertyTypeMismatch<T>(
        propertyName: string, actual: { [key: string]: ParsedValue }, expected: T) {
        return this.addPropertyName(propertyName, this.getTypeMismatch(actual[propertyName], expected));
    }

    /** @internal */
    public static getTypeMismatch<T>(actual: ParsedValue, expected: T) {
        const actualType = ParseHelper.getTypeName(actual);
        const expectedType = ParseHelper.getTypeName(expected);

        return `The actual type ${actualType} does not match the expected type ${expectedType}.`;
    }

    /** @internal */
    public static getUnknownValue(propertyName: string, value: string) {
        return this.addPropertyName(propertyName, `Unknown value '${value}'.`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static hasProperty<T extends string>(
        value: ParsedValue, propertyName: T): value is { [K in T]: ParsedValue } {
        return this.isObject(value) && value.hasOwnProperty(propertyName);
    }

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
