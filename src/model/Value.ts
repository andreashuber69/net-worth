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

// tslint:disable-next-line:ban-types
export type DefinedPrimitiveUnknown = boolean | number | string | symbol | Function | null;

export type PrimitiveUnknown = DefinedPrimitiveUnknown | undefined;

/**
 * Represents a defined unknown value, a value that can be of any type except `undefined`.
 * @description [[DefinedUnknown]] = {} | null would be a more sensible definition as any type is assignable to an empty
 * interface. However, it appears that tslint is currently unable to handle such a type definition correctly. More
 * precisely, the rule `strict-type-predicates` often reports false positives. With the current definition, there are
 * still some false positives but much fewer.
 */
export type DefinedUnknown = DefinedPrimitiveUnknown | { [key: string]: Unknown } | any[];

/**
 * Represents an unknown value.
 * @description This is a safe alternative to the built-in type `any`. While `any` is perfect for expressing that a
 * value can be anything, `any` has the problem that the compiler silently accepts just about all operations involving
 * values of type `any`. This type aims at retaining the former quality while doing away with the latter.
 */
export type Unknown = DefinedUnknown | undefined;

/**
 * Provides methods aimed at the type-safe analysis of values of unknown origin.
 * @description This is primarily useful for picking apart values coming from `JSON.parse`.
 */
export class Value {
    /** @internal */
    public static isObject(value: Unknown): value is { [key: string]: Unknown } {
        return value instanceof Object;
    }

    /** @internal */
    public static isArray(value: Unknown): value is Unknown[] {
        return Array.isArray(value);
    }

    /** @internal */
    public static hasNumberProperty<T extends string>(value: Unknown, propertyName: T): value is { [K in T]: number } {
        // False positive
        // tslint:disable-next-line:strict-type-predicates
        return this.hasProperty(value, propertyName) && (typeof value[propertyName] === "number");
    }

    /** @internal */
    public static hasStringProperty<T extends string>(value: Unknown, propertyName: T): value is { [K in T]: string } {
        // False positive
        // tslint:disable-next-line:strict-type-predicates
        return this.hasProperty(value, propertyName) && (typeof value[propertyName] === "string");
    }

    /** @internal */
    public static hasArrayProperty<T extends string>(
        value: Unknown, propertyName: T): value is { [K in T]: Unknown[] } {
        return this.hasProperty(value, propertyName) && this.isArray(value[propertyName]);
    }

    /** @internal */
    public static hasObjectProperty<T extends string>(value: Unknown, propertyName: T): value is { [K in T]: Unknown } {
        return this.hasProperty(value, propertyName) && this.isObject(value[propertyName]);
    }

    /** @internal */
    public static getPropertyTypeMismatch<T>(propertyName: string, actual: { [key: string]: Unknown }, expected: T) {
        return this.addPropertyName(propertyName, this.getTypeMismatch(actual[propertyName], expected));
    }

    /** @internal */
    public static getTypeMismatch<T>(actual: Unknown, expected: T) {
        const actualType = Value.getTypeName(actual);
        const expectedType = Value.getTypeName(expected);

        return `The actual type ${actualType} does not match the expected type ${expectedType}.`;
    }

    /** @internal */
    public static getUnknownValue(propertyName: string, value: string) {
        return this.addPropertyName(propertyName, `Unknown value '${value}'.`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static hasProperty<T extends string>(
        value: Unknown, propertyName: T): value is { [K in T]: Unknown } {
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
