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

import { AssetInputInfo } from "./AssetInputInfo";
import { BtcWallet } from "./BtcWallet";
import { BtgWallet } from "./BtgWallet";
import { CryptoWalletInputInfo } from "./CryptoWalletInputInfo";
import { DashWallet } from "./DashWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { EtcWallet } from "./EtcWallet";
import { EthWallet } from "./EthWallet";
import { GoldAsset } from "./GoldAsset";
import { LtcWallet } from "./LtcWallet";
import { MiscAssetInputInfo } from "./MiscAssetInputInfo";
import { PalladiumAsset } from "./PalladiumAsset";
import { PlatinumAsset } from "./PlatinumAsset";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import { SilverAsset } from "./SilverAsset";
import { erc20TokensWalletTypeNames, IErc20TokensObject } from "./validation/schemas/IErc20TokensWallet.schema";
import { IErc20TokensWalletProperties } from "./validation/schemas/IErc20TokensWalletProperties.schema";
import { IMiscObject, miscAssetTypeNames } from "./validation/schemas/IMiscAsset.schema";
import { IPreciousMetalObject, preciousMetalAssetTypeNames } from "./validation/schemas/IPreciousMetalAsset.schema";
import { ISimpleCryptoObject, simpleCryptoWalletTypeNames } from "./validation/schemas/ISimpleCryptoWallet.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";
import { ObjectUnion } from "./validation/schemas/ObjectUnion.schema";
import { ZecWallet } from "./ZecWallet";

// cSpell:ignore xpub, ypub, Mtub, Ltub, drkp
const btcHint =
    "The wallets public address, single or xpub (ypub is not supported). " +
    "<strong style='color:red'>Will be sent to blockchain.info to query the balance.</strong>";

const ltcHint =
    "The wallets single public address (neither Mtub nor Ltub are supported). " +
    "<strong style='color:red'>Will be sent to blockcypher.com to query the balance.</strong>";

const etcHint =
    "The wallets single public address (xpub is not supported). " +
    "<strong style='color:red'>Will be sent to blockscout.com to query the balance.</strong>";

const ethHint =
    "The wallets single public address (xpub is not supported). " +
    "<strong style='color:red'>Will be sent to ethplorer.io to query the ETH balance.</strong>";

const erc20Hint =
    "The wallets single public address (xpub is not supported). " +
    "<strong style='color:red'>Will be sent to ethplorer.io to query ERC20 token balances.</strong>";

const btgHint =
    "The wallets single public address (ypub is not supported). " +
    "<strong style='color:red'>Will be sent to bitcoingold.org to query the balance.</strong>";

const dashHint =
    "The wallets single public address (drkp is not supported). " +
    "<strong style='color:red'>Will be sent to blockcypher.com to query the balance.</strong>";

const zecHint =
    "The wallets single public address (xpub is not supported). " +
    "<strong style='color:red'>Will be sent to zcha.in to query the balance.</strong>";

type Converters<P, S, E, M, PR, SR, ER, MR> = [
    (value: P, info: PreciousMetalAssetInputInfo) => PR,
    (value: S, info: CryptoWalletInputInfo<ISimpleCryptoWalletProperties>) => SR,
    (value: E, info: CryptoWalletInputInfo<IErc20TokensWalletProperties>) => ER,
    (value: M, info: MiscAssetInputInfo) => MR,
];

export class ObjectConverter {
    public static readonly infos = [
        new PreciousMetalAssetInputInfo("Silver", SilverAsset),
        new PreciousMetalAssetInputInfo("Palladium", PalladiumAsset),
        new PreciousMetalAssetInputInfo("Platinum", PlatinumAsset),
        new PreciousMetalAssetInputInfo("Gold", GoldAsset),
        new CryptoWalletInputInfo<ISimpleCryptoWalletProperties>(
            { type: "Bitcoin", ctor: BtcWallet, addressHint: btcHint, quantityDecimals: 8 }),
        new CryptoWalletInputInfo<ISimpleCryptoWalletProperties>(
            { type: "Litecoin", ctor: LtcWallet, addressHint: ltcHint, quantityDecimals: 8 }),
        new CryptoWalletInputInfo<ISimpleCryptoWalletProperties>(
            { type: "Ethereum Classic", ctor: EtcWallet, addressHint: etcHint, quantityDecimals: 18 }),
        new CryptoWalletInputInfo<IErc20TokensWalletProperties>(
            { type: "ERC20 Tokens", ctor: Erc20TokensWallet, addressHint: erc20Hint }),
        new CryptoWalletInputInfo<ISimpleCryptoWalletProperties>(
            { type: "Ethereum", ctor: EthWallet, addressHint: ethHint, quantityDecimals: 18 }),
        new CryptoWalletInputInfo<ISimpleCryptoWalletProperties>(
            { type: "Bitcoin Gold", ctor: BtgWallet, addressHint: btgHint, quantityDecimals: 8 }),
        new CryptoWalletInputInfo<ISimpleCryptoWalletProperties>(
            { type: "Dash", ctor: DashWallet, addressHint: dashHint, quantityDecimals: 8 }),
        new CryptoWalletInputInfo<ISimpleCryptoWalletProperties>(
            { type: "Zcash", ctor: ZecWallet, addressHint: zecHint, quantityDecimals: 8 }),
        new MiscAssetInputInfo(),
    ] as const;

    public static convert<
        P extends IPreciousMetalObject,
        S extends ISimpleCryptoObject,
        E extends IErc20TokensObject,
        M extends IMiscObject,
        PR, SR, ER, MR,
    >(
        rawObject: P | S | E | M,
        [convertPreciousMetalObject, convertSimpleCryptoObject, convertErc20TokensObject, convertMiscObject]:
            Converters<P, S, E, M, PR, SR, ER, MR>,
    ) {
        // TODO: This is rather unwieldy. Once we switch over to schema-based validation completely, some of this should
        // go away...
        if (ObjectConverter.is<P>(rawObject, preciousMetalAssetTypeNames)) {
            const info = ObjectConverter.getInfo<PreciousMetalAssetInputInfo>(rawObject.type);

            return [info, convertPreciousMetalObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<S>(rawObject, simpleCryptoWalletTypeNames)) {
            const info = ObjectConverter.getInfo<CryptoWalletInputInfo<ISimpleCryptoWalletProperties>>(rawObject.type);

            return [info, convertSimpleCryptoObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<E>(rawObject, erc20TokensWalletTypeNames)) {
            const info = ObjectConverter.getInfo<CryptoWalletInputInfo<IErc20TokensWalletProperties>>(rawObject.type);

            return [info, convertErc20TokensObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<M>(rawObject, miscAssetTypeNames)) {
            const info = ObjectConverter.getInfo<MiscAssetInputInfo>(rawObject.type);

            return [info, convertMiscObject(rawObject, info)] as const;
        } else {
            throw ObjectConverter.getUnhandledError(rawObject);
        }
    }

    public static is<T extends ObjectUnion>(
        rawObject: ObjectUnion, types: ReadonlyArray<T["type"]>): rawObject is T {
        return types.includes(rawObject.type);
    }

    private static getInfo<T extends (typeof ObjectConverter.infos)[number]>(type: T["type"]) {
        const result = ObjectConverter.infos.find<T>((info: AssetInputInfo): info is T => info.type === type);

        if (!result) {
            // TODO: Can't we do this statically?
            throw new Error("InputInfo not found!");
        }

        return result;
    }

    private static getUnhandledError(value: never) {
        return new Error(value);
    }
}
