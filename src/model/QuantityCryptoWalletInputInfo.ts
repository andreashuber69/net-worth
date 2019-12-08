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
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { TextInputInfo } from "./TextInputInfo";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";

interface IQuantityCryptoWalletInputInfoParameters extends
    ICryptoWalletInputInfoParameters<Erc20TokensWallet, IQuantityCryptoWalletProperties> {
    readonly quantityDecimals: 8 | 18;
}

export class QuantityCryptoWalletInputInfo extends
    CryptoWalletInputInfo<Erc20TokensWallet, IQuantityCryptoWalletProperties> {
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
