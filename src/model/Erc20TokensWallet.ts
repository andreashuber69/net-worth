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
import { Erc20TokensWalletBundle } from "./Erc20TokensWalletBundle";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { erc20Tokens } from "./validation/schemas/AssetTypeName.schema";
import { IAddressCryptoWallet } from "./validation/schemas/IAddressCryptoWallet.schema";
import { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";

/** Represents a wallet for ERC20 tokens. */
export class Erc20TokensWallet extends RealCryptoWallet {
    public static readonly type = erc20Tokens;

    public readonly type = erc20Tokens;

    public constructor(parent: IParent, props: IAddressCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, ""));
    }

    public bundle(bundle?: unknown): Erc20TokensWalletBundle {
        return new Erc20TokensWalletBundle(this, bundle);
    }

    /** @internal */
    public toJSON(): IAddressCryptoWallet {
        return {
            type: this.type,
            ...this.getProperties(),
            address: this.address,
        };
    }
}
