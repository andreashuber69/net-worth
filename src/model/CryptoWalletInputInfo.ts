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

import { Asset } from "./Asset";
import { AssetInputInfo, IAssetConstructor } from "./AssetInputInfo";
import { AssetPropertyName } from "./AssetInterfaces";
import { EditableCryptoWalletType } from "./AssetTypes";
import { CompositeInput } from "./Input";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { Unknown } from "./Value";
import { WeightUnit } from "./WeightUnit";

/**
 * Defines how the properties of a crypto currency wallet need to be input and validated and provides a method to create
 * a representation of the wallet.
 */
export class CryptoWalletInputInfo extends AssetInputInfo {
    public readonly description = new TextInputInfo(
        "Description", "The purpose of the wallet, e.g. 'Spending', 'Savings', 'Cold Storage'.", true, true);
    public readonly location = new TextInputInfo(
        "Location", "The location of the wallet, e.g. 'Mobile Phone', 'Hardware Wallet', 'Safety Deposit Box'.",
        true, false);
    public readonly address: TextInputInfo;

    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo<typeof WeightUnit>();
    public readonly fineness = new TextInputInfo();
    public readonly quantity: TextInputInfo;

    /** @internal */
    public constructor(
        public readonly type: EditableCryptoWalletType, ctor: IAssetConstructor,
        addressHint: string, quantityDecimals: number) {
        super(ctor);
        this.address = new TextInputInfo("Address", addressHint, true, false);
        this.quantity = new TextInputInfo(
            "Quantity", "The amount in the wallet.", true, false, 0, undefined, Math.pow(10, -quantityDecimals));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected validateRelations(input: CompositeInput, propertyName: AssetPropertyName) {
        if (((propertyName === Asset.addressName) || (propertyName === Asset.quantityName)) &&
            (CryptoWalletInputInfo.isUndefined(input.address) === CryptoWalletInputInfo.isUndefined(input.quantity))) {
            return `A value is required for either the ${this.address.label} or the ${this.quantity.label} (not both).`;
        }

        return super.validateRelations(input, propertyName);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static isUndefined(value: Unknown | null | undefined) {
        return (value === undefined) || (value === null) || (value === "");
    }
}
