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

import { Prop, Vue } from "vue-property-decorator";

/** Provides common component functionality. */
// tslint:disable-next-line:no-unsafe-any
export class ComponentBase<T> extends Vue {
    // TODO: Check whether this should be renamed to value
    @Prop()
    public modelProp?: T;

    /**
     * Provides the model.
     * @description Provides whatever is set for `modelProp`, but ensures that the value cannot be undefined.
     */
    public get model() {
        if (!this.modelProp) {
            throw new Error("No model set.");
        }

        return this.modelProp;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** Gets the control with the supplied ref. */
    protected getControl(ref: string) {
        // TODO: no-unnecessary-type-assertion is probably a false positive, see
        // https://github.com/palantir/tslint/issues/3540
        // tslint:disable-next-line:no-unsafe-any no-unnecessary-type-assertion
        return this.$refs[ref] as Vue;
    }
}
