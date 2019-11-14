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

/**
 * Provides methods aimed at the type-safe analysis of values of unknown origin.
 * @description This is primarily useful for picking apart values coming from `JSON.parse`.
 */
export class Value {
    /**
     * Returns whether the type of `value` is `number`.
     * @description This method is typically used as follows: `array.filter(Value.isNumber)`.
     */
    public static isNumber(value: Unknown | null | undefined): value is number {
        return typeof value === "number";
    }

    /**
     * Returns whether the type of `value` is `string`.
     * @description This method is typically used as follows: `array.filter(Value.isString)`.
     */
    public static isString(value: Unknown | null | undefined): value is string {
        return typeof value === "string";
    }

    /**
     * Returns whether the type of `value` is `Object`.
     * @description This is only useful if calling code needs to iterate over the properties of `value`. Code that needs
     * to establish whether `value` has a property with a given name and type should rather call [[hasNumberProperty]],
     * [[hasStringProperty]], [[hasObjectProperty]] or [[hasArrayProperty]].
     */
    public static isObject(value: Unknown | null | undefined): value is { [key: string]: Unknown | null | undefined } {
        return value instanceof Object;
    }

    /** Returns whether the type of `value` is `Array`. */
    public static isArray(value: Unknown | null | undefined): value is Array<Unknown | null | undefined> {
        return Array.isArray(value);
    }

    /** Returns whether `value` has an own property of type `number` with the name `propertyName`. */
    public static hasNumberProperty<T extends string>(
        value: Unknown | null | undefined, propertyName: T): value is { [K in T]: number } {
        return Value.hasProperty(value, propertyName) && Value.isNumber(value[propertyName]);
    }

    /** Returns whether `value` has an own property of type `string` with the name `propertyName`. */
    public static hasStringProperty<T extends string>(
        value: Unknown | null | undefined, propertyName: T): value is { [K in T]: string } {
        return Value.hasProperty(value, propertyName) && Value.isString(value[propertyName]);
    }

    /** Returns whether `value` has an own property of type `Object` with the name `propertyName`. */
    public static hasObjectProperty<T extends string>(value: Unknown | null | undefined, propertyName: T):
        value is { [K in T]: { [key: string]: Unknown | null | undefined } } {
        return Value.hasProperty(value, propertyName) && Value.isObject(value[propertyName]);
    }

    /** Returns whether `value` has an own property of type `Array` with the name `propertyName`. */
    public static hasArrayProperty<T extends string>(
        value: Unknown | null | undefined, propertyName: T): value is { [K in T]: Array<Unknown | null | undefined> } {
        return Value.hasProperty(value, propertyName) && Value.isArray(value[propertyName]);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static hasProperty<T extends string>(
        value: Unknown | null | undefined, propertyName: T): value is { [K in T]: Unknown | null | undefined } {
        return Value.isObject(value) && value.hasOwnProperty(propertyName);
    }
}
