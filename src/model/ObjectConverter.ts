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

import { AddressCryptoWalletInputInfo } from "./AddressCryptoWalletInputInfo";
import { BtcWallet } from "./BtcWallet";
import { BtgWallet } from "./BtgWallet";
import { DashWallet } from "./DashWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { EtcWallet } from "./EtcWallet";
import { EthWallet } from "./EthWallet";
import { GoldAsset } from "./GoldAsset";
import { LtcWallet } from "./LtcWallet";
import { MiscAsset } from "./MiscAsset";
import { MiscAssetInputInfo } from "./MiscAssetInputInfo";
import { PalladiumAsset } from "./PalladiumAsset";
import { PlatinumAsset } from "./PlatinumAsset";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import { QuantityCryptoWalletInputInfo } from "./QuantityCryptoWalletInputInfo";
import { SilverAsset } from "./SilverAsset";
import { SimpleCryptoWalletInputInfo } from "./SimpleCryptoWalletInputInfo";
import { addressCryptoWalletTypeNames, IAddressCryptoObject } from "./validation/schemas/IAddressCryptoWallet.schema";
import { IMiscObject, miscAssetTypeNames } from "./validation/schemas/IMiscAsset.schema";
import { IPreciousMetalObject, preciousMetalAssetTypeNames } from "./validation/schemas/IPreciousMetalAsset.schema";
import {
    IQuantityCryptoObject, quantityCryptoWalletTypeNames,
} from "./validation/schemas/IQuantityCryptoWallet.schema";
import { ISimpleCryptoObject, simpleCryptoWalletTypeNames } from "./validation/schemas/ISimpleCryptoWallet.schema";
import { ObjectUnion } from "./validation/schemas/ObjectUnion.schema";
import { XmrWallet } from "./XmrWallet";
import { ZecWallet } from "./ZecWallet";

// cSpell:ignore xpub, ypub, Mtub, Ltub, drkp, zcha
const btcHint =
    "The wallets public address, single or xpub (ypub is not supported). " +
    "Will be sent to blockchain.info to query the balance.";

const ltcHint =
    "The wallets single public address (neither Mtub nor Ltub are supported). " +
    "Will be sent to blockcypher.com to query the balance.";

const etcHint =
    "The wallets single public address (xpub is not supported). " +
    "Will be sent to blockscout.com to query the balance.";

const ethHint =
    "The wallets single public address (xpub is not supported). " +
    "Will be sent to ethplorer.io to query the ETH balance.";

const erc20Hint =
    "The wallets single public address (xpub is not supported). " +
    "Will be sent to ethplorer.io to query ERC20 token balances.";

const btgHint =
    "The wallets single public address (ypub is not supported). " +
    "Will be sent to bitcoingold.org to query the balance.";

const dashHint =
    "The wallets single public address (drkp is not supported). " +
    "Will be sent to blockcypher.com to query the balance.";

const zecHint =
    "The wallets single public address (xpub is not supported). " +
    "Will be sent to zcha.in to query the balance.";

type Converters<P, S, A, Q, M, PR, SR, AR, QR, MR> = readonly [
    (value: P, info: PreciousMetalAssetInputInfo) => PR,
    (value: S, info: SimpleCryptoWalletInputInfo) => SR,
    (value: A, info: AddressCryptoWalletInputInfo) => AR,
    (value: Q, info: QuantityCryptoWalletInputInfo) => QR,
    (value: M, info: MiscAssetInputInfo) => MR,
];

export class ObjectConverter {
    public static readonly infos = {
        [SilverAsset.type]: new PreciousMetalAssetInputInfo(SilverAsset),
        [PalladiumAsset.type]: new PreciousMetalAssetInputInfo(PalladiumAsset),
        [PlatinumAsset.type]: new PreciousMetalAssetInputInfo(PlatinumAsset),
        [GoldAsset.type]: new PreciousMetalAssetInputInfo(GoldAsset),
        [BtcWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: BtcWallet, addressHint: btcHint, quantityDecimals: 8 }),
        [XmrWallet.type]: new QuantityCryptoWalletInputInfo({ ctor: XmrWallet, quantityDecimals: 8 }),
        [LtcWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: LtcWallet, addressHint: ltcHint, quantityDecimals: 8 }),
        [EtcWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: EtcWallet, addressHint: etcHint, quantityDecimals: 18 }),
        [Erc20TokensWallet.type]: new AddressCryptoWalletInputInfo({ ctor: Erc20TokensWallet, addressHint: erc20Hint }),
        [EthWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: EthWallet, addressHint: ethHint, quantityDecimals: 18 }),
        [BtgWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: BtgWallet, addressHint: btgHint, quantityDecimals: 8 }),
        [DashWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: DashWallet, addressHint: dashHint, quantityDecimals: 8 }),
        [ZecWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: ZecWallet, addressHint: zecHint, quantityDecimals: 8 }),
        [MiscAsset.type]: new MiscAssetInputInfo(),
    } as const;

    public static convert<
        P extends IPreciousMetalObject,
        S extends ISimpleCryptoObject,
        A extends IAddressCryptoObject,
        Q extends IQuantityCryptoObject,
        M extends IMiscObject,
        PR, SR, AR, QR, MR,
    >(
        rawObject: P | S | A | Q | M,
        [
            convertPreciousMetalObject,
            convertSimpleCryptoObject,
            convertAddressCryptoObject,
            convertQuantityCryptoObject,
            convertMiscObject,
        ]: Converters<P, S, A, Q, M, PR, SR, AR, QR, MR>,
    ) {
        // TODO: This is rather unwieldy. Once we switch over to schema-based validation completely, some of this should
        // go away...
        if (ObjectConverter.is<P>(rawObject, preciousMetalAssetTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertPreciousMetalObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<S>(rawObject, simpleCryptoWalletTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertSimpleCryptoObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<A>(rawObject, addressCryptoWalletTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertAddressCryptoObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<Q>(rawObject, quantityCryptoWalletTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertQuantityCryptoObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<M>(rawObject, miscAssetTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertMiscObject(rawObject, info)] as const;
        }

        ObjectConverter.assertUnreachable(rawObject);
    }

    public static is<T extends ObjectUnion>(
        rawObject: ObjectUnion,
        types: ReadonlyArray<T["type"]>,
    ): rawObject is T {
        return types.includes(rawObject.type);
    }

    private static assertUnreachable(value: never): never {
        throw new Error(value);
    }
}
