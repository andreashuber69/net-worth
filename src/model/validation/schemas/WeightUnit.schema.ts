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

/** Enumerates the weight units supported by the application. */
export enum WeightUnit {
    "g" = 1,
    "kg" = 1000,
    "gr" = 0.06479891, // https://en.wikipedia.org/wiki/Grain_(unit)
    "t oz" = gr * 480, // https://en.wikipedia.org/wiki/Ounce
    "oz" = gr * 437.5, // https://en.wikipedia.org/wiki/Ounce
}
