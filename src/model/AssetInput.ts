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

import { IModel } from "./Asset";
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
import { erc20TokensWalletTypeNames, ITaggedErc20TokensWallet } from "./validation/schemas/ITaggedErc20TokensWallet";
import { ITaggedMiscAsset, miscAssetTypeNames } from "./validation/schemas/ITaggedMiscAsset";
import { ITaggedPreciousMetalAsset, preciousMetalAssetTypeNames } from "./validation/schemas/ITaggedPreciousMetalAsset";
import { ITaggedSimpleCryptoWallet, simpleCryptoWalletTypeNames } from "./validation/schemas/ITaggedSimpleCryptoWallet";
import { TaggedAssetBundleUnion } from "./validation/schemas/TaggedAssetBundleUnion";
import { TaggedAssetUnion } from "./validation/schemas/TaggedAssetUnion";
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

type Converters<T> = [
    (asset: ITaggedPreciousMetalAsset, info: PreciousMetalAssetInputInfo) => T,
    (asset: ITaggedSimpleCryptoWallet, info: CryptoWalletInputInfo) => T,
    (asset: ITaggedErc20TokensWallet, info: CryptoWalletInputInfo) => T,
    (asset: ITaggedMiscAsset, info: MiscAssetInputInfo) => T,
];

class AssetConverter {
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

    public static convert<T>(
        rawAsset: TaggedAssetUnion,
        [convertPmAsset, convertSimpleCryptoWallet, convertErc20TokensWallet, convertMiscAsset]: Converters<T>,
    ) {
        // TODO: This is rather unwieldy. Once we switch over to schema-based validation completely, some of this should
        // go away...
        if (AssetConverter.isAsset<ITaggedPreciousMetalAsset>(rawAsset, preciousMetalAssetTypeNames)) {
            const info = AssetConverter.getInfo<PreciousMetalAssetInputInfo>(rawAsset.type);

            return [ info, convertPmAsset(rawAsset, info) ] as const;
        } else if (AssetConverter.isAsset<ITaggedSimpleCryptoWallet>(rawAsset, simpleCryptoWalletTypeNames)) {
            const info = AssetConverter.getInfo<CryptoWalletInputInfo>(rawAsset.type);

            return [ info, convertSimpleCryptoWallet(rawAsset, info) ] as const;
        } else if (AssetConverter.isAsset<ITaggedErc20TokensWallet>(rawAsset, erc20TokensWalletTypeNames)) {
            const info = AssetConverter.getInfo<CryptoWalletInputInfo>(rawAsset.type);

            return [ info, convertErc20TokensWallet(rawAsset, info) ] as const;
        } else if (AssetConverter.isAsset<ITaggedMiscAsset>(rawAsset, miscAssetTypeNames)) {
            const info = AssetConverter.getInfo<MiscAssetInputInfo>(rawAsset.type);

            return [ info, convertMiscAsset(rawAsset, info) ] as const;
        } else {
            throw AssetConverter.getUnhandledError(rawAsset);
        }
    }

    private static isAsset<T extends TaggedAssetUnion>(asset: TaggedAssetUnion, types: readonly string[]): asset is T {
        return types.includes(asset.type);
    }

    private static getInfo<T extends (typeof AssetConverter.infos)[number]>(type: T["type"]) {
        const result = AssetConverter.infos.find<T>((info: AssetInputInfo): info is T => info.type === type);

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

// tslint:disable-next-line: max-classes-per-file
export class AssetInput {
    /** Provides information objects for each of the supported asset types. */
    public static readonly infos = AssetConverter.infos;

    /** @internal */
    public static parseBundle(rawBundle: TaggedAssetBundleUnion) {
        const [info, result] = AssetInput.parseBundleImpl(rawBundle);
        const validationResult = info.validateAll(rawBundle.primaryAsset);

        return (validationResult === true) ? result : validationResult;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static parseBundleImpl(rawBundle: TaggedAssetBundleUnion) {
        return AssetConverter.convert(rawBundle.primaryAsset, [
            (asset, info) => ((model: IModel) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset, info) => ((model: IModel) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset, info) => ((model: IModel) => info.createAsset(model, asset).bundle(rawBundle)),
            (asset, info) => ((model: IModel) => info.createAsset(model, asset).bundle(rawBundle)),
        ]);
    }
}
