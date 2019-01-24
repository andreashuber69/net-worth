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

import { Prop, Vue } from "vue-property-decorator";

/** Defines common component functionality. */
export class ComponentBase<T> extends Vue {
    @Prop()
    public value?: T;

    /**
     * Provides the value.
     * @description Provides whatever is set for `value`, but ensures that the value cannot be undefined.
     */
    public get checkedValue() {
        if (this.value === undefined) {
            throw new Error("No value set.");
        }

        return this.value;
    }

    public set checkedValue(value: T) {
        this.$emit("input", value);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** Gets the control with the supplied ref. */
    protected getControl(ref: string) {
        return this.$refs[ref] as Vue;
    }
}
