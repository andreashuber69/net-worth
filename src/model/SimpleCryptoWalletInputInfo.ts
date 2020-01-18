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

import { AssetPropertyName } from "./AssetInterfaces";
import { CryptoWalletInputInfo, ICryptoWalletInputInfoParameters } from "./CryptoWalletInputInfo";
import { CompositeInput } from "./Input";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { TextInputInfo } from "./TextInputInfo";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

interface ISimpleCryptoWalletInputInfoParameters extends
    ICryptoWalletInputInfoParameters<SimpleCryptoWallet, ISimpleCryptoWalletProperties> {
    readonly addressHint: string;
    readonly quantityDecimals: 8 | 18;
}

/**
 * Defines how the properties of a simple crypto currency wallet need to be input and validated and provides a method to
 * create a representation of the wallet.
 */
export class SimpleCryptoWalletInputInfo extends
    CryptoWalletInputInfo<SimpleCryptoWallet, ISimpleCryptoWalletProperties> {
    public readonly address: TextInputInfo;
    public readonly quantity: TextInputInfo;

    /** @internal */
    public constructor(parameters: ISimpleCryptoWalletInputInfoParameters) {
        super(parameters);
        const { addressHint, quantityDecimals } = parameters;
        this.address = new TextInputInfo({
            label: "Address", hint: addressHint, isPresent: true, isRequired: !quantityDecimals, schemaName: "Text",
        });
        this.quantity = new TextInputInfo({
            label: "Quantity", hint: "The amount in the wallet.", isPresent: true, isRequired: false,
            schemaName: SimpleCryptoWalletInputInfo.getSchema(quantityDecimals),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected validateRelations(input: CompositeInput, propertyName: AssetPropertyName) {
        if (!this.address.isRequired &&
            ((propertyName === "address") || (propertyName === "quantity")) &&
            (SimpleCryptoWalletInputInfo.isUndefined(input.address) ===
                SimpleCryptoWalletInputInfo.isUndefined(input.quantity))) {
            return `A value is required for either the ${this.address.label} or the ${this.quantity.label} (not both).`;
        }

        return super.validateRelations(input, propertyName);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static isUndefined(value: unknown) {
        return (value === undefined) || (value === null) || (value === "");
    }
}
