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

interface IConstructor {
    new (parent: IModel, properties: IAssetPropertiesIntersection): Asset;
}

/**
 * Defines how a particular asset type is displayed in the asset editor UI.
 */
export class AssetInfo {
    /**
     * Creates a new instance of the [[AssetInfo]] class.
     * @param type The name of the asset.
     * @param hasDescription Whether the asset has a description property.
     * @param descriptionHint The hint to display for the description.
     * @param hasLocation Whether the asset has a location property.
     * @param locationHint The hint to display for the location.
     * @param hasAddress Whether the asset has an address property.
     * @param hasWeight Whether the asset has a weight property.
     * @param hasWeightUnit Whether the asset has an weightUnit property.
     * @param hasFineness Whether the asset has a fineness property.
     * @param hasQuantity Whether the asset has a quantity property.
     * @param isQuantityRequired Whether the asset requires a quantity.
     * @param quantityHint The hint to display for the quantity.
     * @param quantityDecimals The number of decimals to format the quantity to.
     * @param constructor The constructor function to create a new asset.
     */
    public constructor(
        public readonly type: "" | AssetTypes,
        public readonly hasDescription: boolean,
        public readonly descriptionHint: string,
        public readonly hasLocation: boolean,
        public readonly locationHint: string,
        public readonly hasAddress: boolean,
        public readonly hasWeight: boolean,
        public readonly hasWeightUnit: boolean,
        public readonly hasFineness: boolean,
        public readonly hasQuantity: boolean,
        public readonly isQuantityRequired: boolean,
        public readonly quantityHint: string,
        private readonly quantityDecimals: number,
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
