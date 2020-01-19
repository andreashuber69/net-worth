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

import { arrayOfAll } from "../../arrayOfAll";

/** Provides the conversion factors between the unit gram and other weight units. */
export enum WeightUnit {
    "g" = 1,
    "kg" = 1000,
    "gr" = 0.06479891, // https://en.wikipedia.org/wiki/Grain_(unit)
    "t oz" = gr * 480, // https://en.wikipedia.org/wiki/Ounce
    "oz" = gr * 437.5, // https://en.wikipedia.org/wiki/Ounce
}

export type WeightUnitName = keyof typeof WeightUnit;

/**
 * Enumerates the weight units supported by the application.
 * @description While it's easy to get the names of an enum in a string[] it seems impossible to get them in a literal
 * types tuple like this one, which is why we need to repeat them. [[arrayOfAll]] at least ensures that all names are
 * present and that they're written correctly.
 */
export const weightUnitNames = arrayOfAll<WeightUnitName>()("g", "kg", "gr", "t oz", "oz");
