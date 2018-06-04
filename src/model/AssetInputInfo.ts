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
import { AllAssetPropertyNames, IAllAssetProperties } from "./AssetInterfaces";
import { AssetTypes } from "./AssetTypes";
import { Entity } from "./Entity";
import { IAuxProperties } from "./IAuxProperties";
import { IInputInfo } from "./IInputInfo";
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
export abstract class AssetInputInfo implements IAuxProperties<ValueInputInfo>, IInputInfo {
    public abstract get type(): "" | AssetTypes;

    public abstract get description(): TextInputInfo;
    public abstract get location(): TextInputInfo;
    public abstract get address(): TextInputInfo;
    public abstract get weight(): TextInputInfo;
    public abstract get weightUnit(): SelectInputInfo;
    public abstract get fineness(): TextInputInfo;
    public abstract get quantity(): TextInputInfo;

    /**
     * @internal
     * @description This is a property rather than a parameter of [[validate]], because [[validate]] is often
     * (indirectly) called from a context where it is not known whether relations should be validated. For example,
     * validation for Vuetify controls is specified by supplying a function to each control. Said function is then
     * called while the bound value is modified in the control. However, the same function is also called when the
     * whole form is validated. Obviously, relations should not be validated in the former case but they must be in the
     * latter one.
     */
    public includeRelations = false;

    /** @internal */
    public createAsset(parent: IModel, properties: IAllAssetProperties) {
        if (!this.ctor) {
            throw new Error("No constructor specified.");
        }

        return new this.ctor(parent, properties);
    }

    public validate(entity: IAuxProperties<string> | string, propertyName?: AllAssetPropertyNames): true | string {
        if ((propertyName === undefined) || !Entity.isComposite(entity)) {
            throw AssetInputInfo.createPropertyArgumentError();
        }

        const singleResult = this[propertyName].validate(entity, propertyName);

        return (singleResult === true) && this.includeRelations ?
            this.validateRelations(entity, propertyName) : singleResult;
    }

    public get<T extends ValueInputInfo>(ctor: { new(): T }, propertyName?: AllAssetPropertyNames): T {
        if (propertyName === undefined) {
            throw AssetInputInfo.createPropertyArgumentError();
        }

        const result = this[propertyName];

        if (!(result instanceof ctor)) {
            throw new Error(
                `The requested type ${ctor.name} does not match the actual type of the property ${propertyName}.`);
        }

        return result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @internal */
    protected constructor(private readonly ctor?: IAssetConstructor) {
    }

    /** @internal */
    // tslint:disable-next-line:prefer-function-over-method
    protected validateRelations(entity: IAuxProperties<string>, propertyName: AllAssetPropertyNames): true | string {
        return true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static createPropertyArgumentError() {
        return new Error("The propertyName argument must not be undefined.");
    }
}
