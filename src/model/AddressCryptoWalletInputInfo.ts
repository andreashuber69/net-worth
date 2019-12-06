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
import { CryptoWalletInputInfo } from "./CryptoWalletInputInfo";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { TextInputInfo } from "./TextInputInfo";
import { AddressCryptoWalletTypeName } from "./validation/schemas/IAddressCryptoWallet.schema";
import { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";

interface IAddressCryptoWalletInputInfoParameters {
    readonly type: AddressCryptoWalletTypeName;
    readonly ctor: new (parent: IParent, props: IAddressCryptoWalletProperties) => Erc20TokensWallet;
    readonly addressHint: string;
}

export class AddressCryptoWalletInputInfo extends CryptoWalletInputInfo {
    public readonly type: AddressCryptoWalletTypeName;
    public readonly address: TextInputInfo;
    public readonly quantity = new TextInputInfo();

    /** @internal */
    public constructor({ type, ctor, addressHint }: IAddressCryptoWalletInputInfoParameters) {
        super();
        this.type = type;
        this.ctor = ctor;
        this.address = new TextInputInfo({
            label: "Address", hint: addressHint, isPresent: true, isRequired: true, schemaName: "Text",
        });
    }

    public createAsset(parent: IParent, props: IAddressCryptoWalletProperties) {
        return new this.ctor(parent, props);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly ctor: new (parent: IParent, props: IAddressCryptoWalletProperties) => Erc20TokensWallet;
}
