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

import { Asset, IModel } from "./Asset";
import { IAllAssetProperties } from "./AssetInterfaces";
import { ValueInputInfo } from "./ValueInputInfo";

export interface IAssetConstructor {
    new (parent: IModel, properties: IAllAssetProperties): Asset;
}

/** Defines the base for all [[IAssetInputInfo]] implementations. */
export abstract class AssetInputInfo {
    /** @internal */
    public createAsset(parent: IModel, properties: IAllAssetProperties) {
        if (!this.constructor) {
            throw new Error("No constructor specified.");
        }

        return new this.constructor(parent, properties);
    }

    /** @internal */
    public validate(value: IAllAssetProperties, property?: keyof IAllAssetProperties): true | string {
        if (property === undefined) {
            // TODO: Iterate over all properties
            return true;
        }

        const singleResult = this.validateProperty(value, property);

        return singleResult === true ? this.validateImpl(value) : singleResult;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @internal */
    protected constructor(private readonly constructor?: IAssetConstructor) {
    }

    protected abstract getInfo(property: keyof IAllAssetProperties): ValueInputInfo;

    // tslint:disable-next-line:prefer-function-over-method
    protected validateImpl(value: IAllAssetProperties): true | string {
        return true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private validateProperty(value: IAllAssetProperties, property: keyof IAllAssetProperties) {
        return this.getInfo(property).validate(value[property]);
    }
}
