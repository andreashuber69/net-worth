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
import {
    erc20TokensWalletTypeNames, ITaggedErc20TokensObject,
} from "./validation/schemas/ITaggedErc20TokensWallet";
import { ITaggedMiscObject, miscAssetTypeNames } from "./validation/schemas/ITaggedMiscAsset";
import {
    ITaggedPreciousMetalObject, preciousMetalAssetTypeNames,
} from "./validation/schemas/ITaggedPreciousMetalAsset";
import {
    ITaggedSimpleCryptoObject, simpleCryptoWalletTypeNames,
} from "./validation/schemas/ITaggedSimpleCryptoWallet";
import { TaggedObjectUnion } from "./validation/schemas/TaggedObjectUnion";
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
    "<strong style='color:red'>Will be sent to chain.so to query the balance.</strong>";

type Converters<P, S, E, M, PR, SR, ER, MR> = [
    (value: P, info: PreciousMetalAssetInputInfo) => PR,
    (value: S, info: CryptoWalletInputInfo) => SR,
    (value: E, info: CryptoWalletInputInfo) => ER,
    (value: M, info: MiscAssetInputInfo) => MR,
];

export class TaggedObjectConverter {
    public static readonly infos = [
        new PreciousMetalAssetInputInfo("Silver", SilverAsset),
        new PreciousMetalAssetInputInfo("Palladium", PalladiumAsset),
        new PreciousMetalAssetInputInfo("Platinum", PlatinumAsset),
        new PreciousMetalAssetInputInfo("Gold", GoldAsset),
        new CryptoWalletInputInfo({ type: "Bitcoin", ctor: BtcWallet, addressHint: btcHint, quantityDecimals: 8 }),
        new CryptoWalletInputInfo({ type: "Litecoin", ctor: LtcWallet, addressHint: ltcHint, quantityDecimals: 8 }),
        new CryptoWalletInputInfo(
            { type: "Ethereum Classic", ctor: EtcWallet, addressHint: etcHint, quantityDecimals: 18 }),
        new CryptoWalletInputInfo({ type: "ERC20 Tokens", ctor: Erc20TokensWallet, addressHint: erc20Hint }),
        new CryptoWalletInputInfo({ type: "Ethereum", ctor: EthWallet, addressHint: ethHint, quantityDecimals: 18 }),
        new CryptoWalletInputInfo({ type: "Bitcoin Gold", ctor: BtgWallet, addressHint: btgHint, quantityDecimals: 8 }),
        new CryptoWalletInputInfo({ type: "Dash", ctor: DashWallet, addressHint: dashHint, quantityDecimals: 8 }),
        new CryptoWalletInputInfo({ type: "Zcash", ctor: ZecWallet, addressHint: zecHint, quantityDecimals: 8 }),
        new MiscAssetInputInfo(),
    ] as const;

    public static convert<
        P extends ITaggedPreciousMetalObject,
        S extends ITaggedSimpleCryptoObject,
        E extends ITaggedErc20TokensObject,
        M extends ITaggedMiscObject,
        PR, SR, ER, MR,
    >(
        rawObject: P | S | E | M,
        [convertPreciousMetalObject, convertSimpleCryptoObject, convertErc20TokensObject, convertMiscObject]:
            Converters<P, S, E, M, PR, SR, ER, MR>,
    ) {
        // TODO: This is rather unwieldy. Once we switch over to schema-based validation completely, some of this should
        // go away...
        if (TaggedObjectConverter.is<P>(rawObject, preciousMetalAssetTypeNames)) {
            const info = TaggedObjectConverter.getInfo<PreciousMetalAssetInputInfo>(rawObject.type);

            return [info, convertPreciousMetalObject(rawObject, info)] as const;
        } else if (TaggedObjectConverter.is<S>(rawObject, simpleCryptoWalletTypeNames)) {
            const info = TaggedObjectConverter.getInfo<CryptoWalletInputInfo>(rawObject.type);

            return [info, convertSimpleCryptoObject(rawObject, info)] as const;
        } else if (TaggedObjectConverter.is<E>(rawObject, erc20TokensWalletTypeNames)) {
            const info = TaggedObjectConverter.getInfo<CryptoWalletInputInfo>(rawObject.type);

            return [info, convertErc20TokensObject(rawObject, info)] as const;
        } else if (TaggedObjectConverter.is<M>(rawObject, miscAssetTypeNames)) {
            const info = TaggedObjectConverter.getInfo<MiscAssetInputInfo>(rawObject.type);

            return [info, convertMiscObject(rawObject, info)] as const;
        } else {
            throw TaggedObjectConverter.getUnhandledError(rawObject);
        }
    }

    private static is<T extends TaggedObjectUnion>(
        rawObject: TaggedObjectUnion, types: ReadonlyArray<T["type"]>): rawObject is T {
        return types.includes(rawObject.type);
    }

    private static getInfo<T extends (typeof TaggedObjectConverter.infos)[number]>(type: T["type"]) {
        const result = TaggedObjectConverter.infos.find<T>((info: AssetInputInfo): info is T => info.type === type);

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
