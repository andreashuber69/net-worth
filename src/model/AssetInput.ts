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
import { erc20TokensWalletTypeNames } from "./validation/schemas/ITaggedErc20TokensWallet";
import { ITaggedErc20TokensWalletBundle } from "./validation/schemas/ITaggedErc20TokensWalletBundle";
import { miscAssetTypeNames } from "./validation/schemas/ITaggedMiscAsset";
import { ITaggedMiscAssetBundle } from "./validation/schemas/ITaggedMiscAssetBundle";
import { preciousMetalAssetTypeNames } from "./validation/schemas/ITaggedPreciousMetalAsset";
import { ITaggedPreciousMetalAssetBundle } from "./validation/schemas/ITaggedPreciousMetalAssetBundle";
import { simpleCryptoWalletTypeNames } from "./validation/schemas/ITaggedSimpleCryptoWallet";
import { ITaggedSimpleCryptoWalletBundle } from "./validation/schemas/ITaggedSimpleCryptoWalletBundle";
import { TaggedAssetBundleUnion } from "./validation/schemas/TaggedAssetBundleUnion";
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

export class AssetInput {
    /** Provides information objects for each of the supported asset types. */
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

    /** @internal */
    public static parseBundle(rawBundle: TaggedAssetBundleUnion) {
        const result = AssetInput.parseBundleImpl(rawBundle);
        const validationResult = result[0].validateAll(rawBundle.primaryAsset);

        if (validationResult === true) {
            return result[1];
        } else {
            return validationResult;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static parseBundleImpl(rawBundle: TaggedAssetBundleUnion) {
        if (AssetInput.isBundle<ITaggedPreciousMetalAssetBundle>(rawBundle, preciousMetalAssetTypeNames)) {
            const info = AssetInput.getInfo<PreciousMetalAssetInputInfo>(rawBundle.primaryAsset);

            return [
                info, (model: IModel) => info.createAsset(model, rawBundle.primaryAsset).bundle(rawBundle),
            ] as const;
        } else if (AssetInput.isBundle<ITaggedSimpleCryptoWalletBundle>(rawBundle, simpleCryptoWalletTypeNames)) {
            const info = AssetInput.getInfo<CryptoWalletInputInfo>(rawBundle.primaryAsset);

            return [
                info, (model: IModel) => info.createAsset(model, rawBundle.primaryAsset).bundle(rawBundle),
            ] as const;
        } else if (AssetInput.isBundle<ITaggedErc20TokensWalletBundle>(rawBundle, erc20TokensWalletTypeNames)) {
            const info = AssetInput.getInfo<CryptoWalletInputInfo>(rawBundle.primaryAsset);

            return [
                info, (model: IModel) => info.createAsset(model, rawBundle.primaryAsset).bundle(rawBundle),
            ] as const;
        } else if (AssetInput.isBundle<ITaggedMiscAssetBundle>(rawBundle, miscAssetTypeNames)) {
            const info = AssetInput.getInfo<MiscAssetInputInfo>(rawBundle.primaryAsset);

            return [
                info, (model: IModel) => info.createAsset(model, rawBundle.primaryAsset).bundle(rawBundle),
            ] as const;
        } else {
            throw AssetInput.getUnhandledError(rawBundle);
        }
    }

    private static isBundle<T extends TaggedAssetBundleUnion>(
        rawBundle: TaggedAssetBundleUnion, types: readonly string[]): rawBundle is T {
        return types.includes(rawBundle.primaryAsset.type);
    }

    private static getInfo<T extends (typeof AssetInput.infos)[number]>(
        rawAsset: Parameters<T["createAsset"]>[1] & { type: T["type"] },
    ) {
        const result = AssetInput.infos.find<T>((info: AssetInputInfo): info is T => info.type === rawAsset.type);

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
