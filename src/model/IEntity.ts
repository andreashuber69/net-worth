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

import { IAuxProperties } from "./IAuxProperties";

/** Provides methods to get and set the properties of an entity. */
export interface IEntity {
    /** Gets the value of a property. */
    getProperty(name?: keyof IAuxProperties<string>): string;

    /** Sets the value of a property. */
    setProperty(value: string, name?: keyof IAuxProperties<string>): void;
}
