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

import { Asset } from "./Asset";
import { AssetInputInfo, IAssetConstructor } from "./AssetInputInfo";
import { AssetPropertyName } from "./AssetInterfaces";
import { CompositeInput } from "./Input";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { Unknown } from "./Unknown";
import { Currency } from "./validation/schemas/Currency";
import { Erc20TokensWalletType } from "./validation/schemas/ISerializedErc20TokensWalletBundle";
import { SimpleCryptoWalletType } from "./validation/schemas/ISerializedSimpleCryptoWalletBundle";
import { WeightUnit } from "./WeightUnit";

type CryptoWalletType = SimpleCryptoWalletType | Erc20TokensWalletType;

interface ICryptoWalletInputInfoParameters {
    readonly type: CryptoWalletType;
    readonly ctor: IAssetConstructor;
    readonly addressHint: string;
    readonly quantityDecimals?: 8 | 18;
}

/**
 * Defines how the properties of a crypto currency wallet need to be input and validated and provides a method to create
 * a representation of the wallet.
 */
export class CryptoWalletInputInfo extends AssetInputInfo {
    public readonly type: CryptoWalletType;
    public readonly description = new TextInputInfo({
        label: "Description", hint: "Describes the wallet, e.g. 'Mycelium', 'Hardware Wallet', 'Paper Wallet'.",
        isPresent: true, isRequired: true, schemaName: "Text",
    });
    public readonly location = new TextInputInfo({
        label: "Location", hint: "The location of the wallet, e.g. 'My Mobile', 'Home', 'Safety Deposit Box'.",
        isPresent: true, isRequired: false, schemaName: "Text",
    });
    public readonly address: TextInputInfo;

    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo<typeof WeightUnit>();
    public readonly fineness = new TextInputInfo();
    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo<typeof Currency>();
    public readonly quantity: TextInputInfo;

    /** @internal */
    public constructor(params: ICryptoWalletInputInfoParameters) {
        super(params.ctor);
        this.type = params.type;

        this.address = new TextInputInfo({
            label: "Address", hint: params.addressHint, isPresent: true, isRequired: !params.quantityDecimals,
            schemaName: "Text",
        });

        this.quantity = CryptoWalletInputInfo.getQuantityInputInfo(params.quantityDecimals);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected validateRelations(input: CompositeInput, propertyName: AssetPropertyName) {
        if (!this.address.isRequired &&
            ((propertyName === Asset.addressName) || (propertyName === Asset.quantityName)) &&
            (CryptoWalletInputInfo.isUndefined(input.address) === CryptoWalletInputInfo.isUndefined(input.quantity))) {
            return `A value is required for either the ${this.address.label} or the ${this.quantity.label} (not both).`;
        }

        return super.validateRelations(input, propertyName);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getQuantityInputInfo(quantityDecimals: 8 | 18 | undefined) {
        if (quantityDecimals) {
            return new TextInputInfo({
                label: "Quantity", hint: "The amount in the wallet.", isPresent: true, isRequired: false,
                schemaName: this.getSchema(quantityDecimals),
            });
        } else {
            return new TextInputInfo();
        }
    }

    private static isUndefined(value: Unknown | null | undefined) {
        return (value === undefined) || (value === null) || (value === "");
    }

    private static getSchema(quantityDecimals: 8 | 18) {
        // tslint:disable-next-line: switch-default
        switch (quantityDecimals) {
            case 8:
                return "Quantity8";
            case 18:
                return "QuantityAny";
        }
    }
}
