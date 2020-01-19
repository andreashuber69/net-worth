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

import { IParent } from "./Asset";
import { AssetInputInfo } from "./AssetInputInfo";
import { PreciousMetalAsset } from "./PreciousMetalAsset";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { PreciousMetalAssetTypeName } from "./validation/schemas/IPreciousMetalAsset.schema";
import { IPreciousMetalAssetProperties } from "./validation/schemas/IPreciousMetalAssetProperties.schema";
import { weightUnitNames } from "./validation/schemas/WeightUnitName.schema";

export interface IPreciousMetalAssetCtor {
    readonly type: PreciousMetalAssetTypeName;
    new (parent: IParent, props: IPreciousMetalAssetProperties): PreciousMetalAsset;
}

/**
 * Defines how the properties of a precious metal asset need to be input and validated and provides a method to create a
 * representation of the asset.
 */
export class PreciousMetalAssetInputInfo extends AssetInputInfo {
    public get type() {
        return this.ctor.type;
    }

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
        items: weightUnitNames, enumSchemaNames: ["WeightUnitName"],
    });
    public readonly fineness = new TextInputInfo({
        label: "Fineness", hint: "The precious metal fineness.", isPresent: true, isRequired: true,
        schemaName: "Fineness",
    });
    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo();
    public readonly quantity = new TextInputInfo({
        label: "Quantity", hint: "The number of items.", isPresent: true, isRequired: true, schemaName: "Quantity0",
    });

    /** @internal */
    public constructor(private readonly ctor: IPreciousMetalAssetCtor) {
        super();
    }

    public createAsset(parent: IParent, props: IPreciousMetalAssetProperties) {
        return new this.ctor(parent, props);
    }
}
