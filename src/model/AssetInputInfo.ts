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
import { AssetTypes } from "./AssetTypes";
import { IAuxProperties } from "./IAuxProperties";
import { IInputInfo } from "./IInputInfo";
import { IValidator } from "./IValidator";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { ValueInputInfo } from "./ValueInputInfo";

export interface IAssetConstructor {
    new (parent: IModel, properties: IAllAssetProperties): Asset;
}

/**
 * Defines how the properties of a given asset type need to be input and validated and provides a method to create a
 * representation of the asset.
 */
export abstract class AssetInputInfo implements
    IAuxProperties<ValueInputInfo>, IValidator<IAllAssetProperties>, IInputInfo {
    public abstract get type(): "" | AssetTypes;

    public abstract get description(): TextInputInfo;
    public abstract get location(): TextInputInfo;
    public abstract get address(): TextInputInfo;
    public abstract get weight(): TextInputInfo;
    public abstract get weightUnit(): SelectInputInfo;
    public abstract get fineness(): TextInputInfo;
    public abstract get quantity(): TextInputInfo;

    /** @internal */
    public createAsset(parent: IModel, properties: IAllAssetProperties) {
        if (!this.ctor) {
            throw new Error("No constructor specified.");
        }

        return new this.ctor(parent, properties);
    }

    /** @internal */
    public validate(value: IAllAssetProperties, property: keyof IAllAssetProperties): true | string {
        const singleResult = this[property].validate(value[property]);

        return singleResult === true ? this.validateImpl(value) : singleResult;
    }

    /** @internal */
    public get<T extends ValueInputInfo>(ctor: { new(): T }, property?: keyof IAuxProperties<ValueInputInfo>): T {
        if (property === undefined) {
            throw new Error("The property argument must not be undefined.");
        }

        const result = this[property];

        if (!(result instanceof ctor)) {
            throw new Error(
                `The requested type ${ctor.name} does not match the actual type of the property ${property}.`);
        }

        return result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @internal */
    protected constructor(private readonly ctor?: IAssetConstructor) {
    }

    /** @internal */
    // tslint:disable-next-line:prefer-function-over-method
    protected validateImpl(value: IAllAssetProperties): true | string {
        return true;
    }
}
