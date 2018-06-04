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

import { SimpleInputInfo } from "./SimpleInputInfo";

/** Provides input information for a property where a valid value needs to be equal to one of a given list of values. */
export class SelectInputInfo extends SimpleInputInfo {
    /** @internal */
    public constructor(
        label = "", hint = "", isPresent = false, isRequired = false, public readonly items: string[] = []) {
        super(label, hint, isPresent, isRequired);
    }
}
