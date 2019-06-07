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

import { IModel } from "./Asset";
import { AssetInputInfo } from "./AssetInputInfo";
import { Currency } from "./Currency";
import { IPreciousMetalAssetProperties } from "./IPreciousMetalAssetProperties";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { PreciousMetalAssetTypeName } from "./validation/schemas/IPreciousMetalAsset";
import { WeightUnit } from "./validation/schemas/WeightUnit";

/**
 * Defines how the properties of a precious metal asset need to be input and validated and provides a method to create a
 * representation of the asset.
 */
export class PreciousMetalAssetInputInfo extends AssetInputInfo {
    public readonly description = new TextInputInfo({
        label: "Description", hint: "Describes the items, e.g. 'Coins', 'Bars'.", isPresent: true, isRequired: true,
        schemaName: "Text",
    });
    public readonly location = new TextInputInfo({
        label: "Location", hint: "The location, e.g. 'Safe', 'Safety Deposit Box'.", isPresent: true, isRequired: false,
        schemaName: "Text",
    });
    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo({
        label: "Weight", hint: "The weight of a single item, expressed in Unit.", isPresent: true, isRequired: true,
        schemaName: "Weight",
    });
    public readonly weightUnit = new SelectInputInfo({
        label: "Unit", hint: "The unit Weight is expressed in.", isPresent: true, isRequired: true,
        enumType: WeightUnit, enumSchemaNames: [ "WeightUnitName", "WeightUnit" ], acceptStringsOnly: false,
    });
    public readonly fineness = new TextInputInfo({
        label: "Fineness", hint: "The precious metal fineness.", isPresent: true, isRequired: true,
        schemaName: "Fineness",
    });
    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo<typeof Currency>();
    public readonly quantity = new TextInputInfo({
        label: "Quantity", hint: "The number of items.", isPresent: true, isRequired: true, schemaName: "Quantity0",
    });

    /** @internal */
    public constructor(
        public readonly type: PreciousMetalAssetTypeName,
        private readonly ctor: new (parent: IModel, props: IPreciousMetalAssetProperties) => PreciousMetalAsset) {
        super();
    }

    public createAsset(parent: IModel, props: IPreciousMetalAssetProperties) {
        return new this.ctor(parent, props);
    }
}
