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

import { IModel } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { AllAssetPropertyNames, IAllAssetProperties } from "./AssetInterfaces";
import { AssetTypes } from "./AssetTypes";
import { IAuxProperties } from "./IAuxProperties";
import { CompositeInput, InputUtility } from "./Input";
import { InputInfo } from "./InputInfo";
import { PrimitiveInputInfo } from "./PrimitiveInputInfo";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { Unknown, Value } from "./Value";

interface IValidationResults extends IAuxProperties<true | string> {
    [key: string]: true | string;
}

export type CreateBundle = (parent: IModel, properties: IAllAssetProperties) => AssetBundle;
/**
 * Defines how the properties of a given asset type need to be input and validated and provides a method to create a
 * representation of the asset.
 */
export abstract class AssetInputInfo extends InputInfo implements IAuxProperties<PrimitiveInputInfo> {
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
    public createBundle(parent: IModel, properties: IAllAssetProperties) {
        if (!this.createBundleCallback) {
            throw new Error("No createBundleCallback was specified.");
        }

        return this.createBundleCallback(parent, properties);
    }

    public get<T extends PrimitiveInputInfo>(ctor: { new(): T }, propertyName?: AllAssetPropertyNames): T {
        if (propertyName === undefined) {
            throw new Error("The propertyName argument cannot be undefined for a composite input.");
        }

        const result = this[propertyName];

        if (!(result instanceof ctor)) {
            throw new Error(
                `The requested type ${ctor.name} does not match the actual type of the property ${propertyName}.`);
        }

        return result;
    }

    public validateAll(input: Unknown) {
        if (!InputUtility.isComposite(input)) {
            return Value.getTypeMismatch(input, {});
        }

        this.includeRelations = true;

        try {
            const results: IValidationResults = {
                description: this.validateComposite(true, input, "description"),
                location: this.validateComposite(true, input, "location"),
                address: this.validateComposite(true, input, "address"),
                weight: this.validateComposite(true, input, "weight"),
                weightUnit: this.validateComposite(true, input, "weightUnit"),
                fineness: this.validateComposite(true, input, "fineness"),
                quantity: this.validateComposite(true, input, "quantity"),
            };

            let message = "";

            for (const key in results) {
                if (results.hasOwnProperty(key)) {
                    const result = results[key];

                    if (result !== true) {
                        message += `${key}: ${result}
`;
                    }
                }
            }

            return message ? message : true;
        } finally {
            this.includeRelations = false;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @internal */
    protected constructor(private readonly createBundleCallback?: CreateBundle) {
        super();
    }

    /** @internal */
    protected validateComposite(strict: boolean, input: CompositeInput, propertyName?: AllAssetPropertyNames) {
        if (propertyName === undefined) {
            throw new Error("The propertyName argument cannot be undefined for a composite value.");
        }

        const singleResult = this[propertyName].validate(strict, input[propertyName], undefined);

        return (singleResult === true) && this.includeRelations ?
            this.validateRelations(input, propertyName) : singleResult;
    }

    /** @internal */
    // tslint:disable-next-line:prefer-function-over-method
    protected validateRelations(input: CompositeInput, propertyName: AllAssetPropertyNames): true | string {
        return true;
    }
}
