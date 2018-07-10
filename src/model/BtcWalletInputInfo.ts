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

import { IAssetConstructor } from "./AssetInputInfo";
import { EditableCryptoWalletType } from "./AssetTypes";
import { CryptoWalletInputInfo } from "./CryptoWalletInputInfo";
import { TextInputInfo } from "./TextInputInfo";

/**
 * Defines how the properties of a BTC wallet need to be input and validated and provides a method to create a
 * representation of the wallet.
 */
export class BtcWalletInputInfo extends CryptoWalletInputInfo {
    public readonly address = new TextInputInfo("Address", BtcWalletInputInfo.hint, true, false);

    /**
     * @internal
     * @description Neither `type` nor `ctor` need to be parameters here, but somehow it does not seem to be possible to
     * pass a constructor function from a constructor. The compiled code consistently fails with a runtime error stating
     * that the constructor function is unknown.
     */
    public constructor(type: EditableCryptoWalletType, ctor: IAssetConstructor) {
        super(type, 8, ctor);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly hint =
        "The wallets public address, single or xpub (ypub is not supported). " +
        "<span style='color:red'>Will be sent to blockchain.info to query the balance.</span>";
}
