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

import { InputInfo } from "./InputInfo";

export class TextFieldInfo extends InputInfo {
    public constructor(
        label = "", hint = "", isVisible = false, isRequired = false,
        public readonly min?: number, public readonly max?: number, public step?: number) {
        super(label, hint, isVisible, isRequired);
    }

    public get type() {
        return ((this.min !== undefined) || (this.max !== undefined) || (this.step !== undefined)) ? "number" : "text";
    }
}
