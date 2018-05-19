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

import { Asset, IModel } from "../model/Asset";
import { IAssetPropertiesIntersection } from "../model/AssetInterfaces";
import { AssetTypes } from "../model/AssetTypes";
import { IProperties } from "./IProperties";
import { PropertyInfo } from "./PropertyInfo";

export interface IAssetInfo extends IProperties<PropertyInfo> {
    readonly type: "" | AssetTypes;
    readonly quantityStep: number;

    createAsset(parent: IModel, properties: IAssetPropertiesIntersection): Asset;
}

export interface IAssetConstructor {
    new (parent: IModel, properties: IAssetPropertiesIntersection): Asset;
}

/** Provides the base for all [[IAssetInfo]] implementations. */
export class AssetInfo {
    /** The smallest number the quantity of the asset can be increased or decreased by. */
    public get quantityStep() {
        return Math.pow(10, -this.quantityDecimals);
    }

    /** @internal */
    public createAsset(parent: IModel, properties: IAssetPropertiesIntersection) {
        if (!this.constructor) {
            throw new Error("No constructor specified.");
        }

        return new this.constructor(parent, properties);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @internal */
    protected constructor(
        private readonly quantityDecimals: number,
        private readonly constructor?: IAssetConstructor,
    ) {
    }
}
