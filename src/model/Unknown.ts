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

type Primitive = boolean | number | string | symbol;

/**
 * Represents a value of unknown type.
 * @description This is a safe alternative to the built-in type `any`. While `any` is perfect for expressing that a
 * value can be anything, `any` has the problem that the compiler silently accepts just about all operations involving
 * values of type `any`. This type aims at retaining the former quality while doing away with the latter. Unlike `any`,
 * a value of this type cannot be `null` or `undefined`. Therefore, parameters or variables needing to include either
 * (or both) can use an appropriate union type, e.g. `Unknown | null | undefined`.
 * [[Unknown]] = {} would be a more sensible definition as any type is assignable to an empty interface. However, it
 * appears that tslint is currently unable to handle such a type definition correctly. More precisely, the rule
 * `strict-type-predicates` often reports false positives. With the current definition, there are still some false
 * positives but much fewer.
 */
export type Unknown = Primitive | object;
