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

import { CryptoWalletInputInfo, ICryptoWalletInputInfoParameters } from "./CryptoWalletInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";
import { XmrWallet } from "./XmrWallet";

interface IQuantityCryptoWalletInputInfoParameters extends
    ICryptoWalletInputInfoParameters<XmrWallet, IQuantityCryptoWalletProperties> {
    readonly quantityDecimals: 8 | 18;
}

export class QuantityCryptoWalletInputInfo extends
    CryptoWalletInputInfo<XmrWallet, IQuantityCryptoWalletProperties> {
    public readonly address = new TextInputInfo();
    public readonly quantity: TextInputInfo;

    /** @internal */
    public constructor(parameters: IQuantityCryptoWalletInputInfoParameters) {
        super(parameters);
        this.quantity = new TextInputInfo({
            label: "Quantity", hint: "The amount in the wallet.", isPresent: true, isRequired: false,
            schemaName: QuantityCryptoWalletInputInfo.getSchema(parameters.quantityDecimals),
        });
    }
}
