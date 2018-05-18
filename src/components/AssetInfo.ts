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
import { Properties } from "./Properties";

interface IConstructor {
    new (parent: IModel, properties: IAssetPropertiesIntersection): Asset;
}

/** Defines how a particular asset type is displayed in the asset editor UI. */
export class AssetInfo {
    /**
     * Creates a new instance of the [[AssetInfo]] class.
     * @param type The type of the asset.
     * @param descriptionHint The hint to display for the description.
     * @param locationHint The hint to display for the location.
     * @param isQuantityRequired Whether the asset requires a quantity.
     * @param quantityHint The hint to display for the quantity.
     * @param quantityDecimals The number of decimals to format the quantity to.
     * @param show The controls for which asset properties should be shown.
     * @param constructor The constructor function to create a new asset.
     */
    public constructor(
        public readonly type: "" | AssetTypes,
        public readonly descriptionHint: string,
        public readonly locationHint: string,
        public readonly isQuantityRequired: boolean,
        public readonly quantityHint: string,
        private readonly quantityDecimals: number,
        public readonly show: Properties<boolean>,
        private readonly constructor?: IConstructor,
    ) {
    }

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
}
