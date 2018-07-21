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

import { Asset, IModel } from "./Asset";
import { AssetBundle } from "./AssetBundle";
import { AssetInputInfo } from "./AssetInputInfo";
import { IAssetIntersection } from "./AssetInterfaces";
import { AssetType } from "./AssetTypes";
import { BtcWallet } from "./BtcWallet";
import { BtgWallet } from "./BtgWallet";
import { CryptoWalletInputInfo } from "./CryptoWalletInputInfo";
import { DashWallet } from "./DashWallet";
import { EtcWallet } from "./EtcWallet";
import { EthWallet } from "./EthWallet";
import { GoldAsset } from "./GoldAsset";
import { LtcWallet } from "./LtcWallet";
import { PalladiumAsset } from "./PalladiumAsset";
import { PlatinumAsset } from "./PlatinumAsset";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import { SilverAsset } from "./SilverAsset";
import { Unknown, Value } from "./Value";
import { ZecWallet } from "./ZecWallet";

const btcHint =
    "The wallets public address, single or xpub (ypub is not supported). " +
    "<span style='color:red'>Will be sent to blockchain.info to query the balance.</span>";

const ltcHint =
    "The wallets single public address (neither Mtub nor Ltub are supported). " +
    "<span style='color:red'>Will be sent to blockcypher.com to query the balance.</span>";

const etcHint =
    "The wallets single public address (xpub is not supported). " +
    "<span style='color:red'>Will be sent to gastracker.io to query the balance.</span>";

const ethHint =
    "The wallets single public address (xpub is not supported). " +
    "<span style='color:red'>Will be sent to ethplorer.io to query ETH and token balances.</span>";

const btgHint =
    "The wallets single public address (ypub is not supported). " +
    "<span style='color:red'>Will be sent to btgexp.com to query the balance.</span>";

const dashHint =
    "The wallets single public address (drkp is not supported). " +
    "<span style='color:red'>Will be sent to blockcypher.com to query the balance.</span>";

const zecHint =
    "The wallets single public address (xpub is not supported). " +
    "<span style='color:red'>Will be sent to chain.so to query the balance.</span>";

// TODO: Eliminate duplication with type constants
export enum AssetTypeEnum {
    "Silver",
    "Palladium",
    "Platinum",
    "Gold",
    "Bitcoin",
    "Litecoin",
    "Ethereum Classic",
    "Ethereum",
    "ERC20 Token",
    "Bitcoin Gold",
    "Dash",
    "Zcash",
}

export class AssetInput {
    /** Provides information objects for each of the supported asset types. */
    public static readonly infos: AssetInputInfo[] = [
        new PreciousMetalAssetInputInfo(AssetType.Ag, SilverAsset),
        new PreciousMetalAssetInputInfo(AssetType.Pd, PalladiumAsset),
        new PreciousMetalAssetInputInfo(AssetType.Pt, PlatinumAsset),
        new PreciousMetalAssetInputInfo(AssetType.Au, GoldAsset),
        new CryptoWalletInputInfo(AssetType.Btc, btcHint, 8, BtcWallet),
        new CryptoWalletInputInfo(AssetType.Ltc, ltcHint, 8, LtcWallet),
        new CryptoWalletInputInfo(AssetType.Etc, etcHint, 18, EtcWallet),
        new CryptoWalletInputInfo(AssetType.Eth, ethHint, 18, EthWallet),
        new CryptoWalletInputInfo(AssetType.Btg, btgHint, 8, BtgWallet),
        new CryptoWalletInputInfo(AssetType.Dash, dashHint, 8, DashWallet),
        new CryptoWalletInputInfo(AssetType.Zec, zecHint, 8, ZecWallet),
    ];

    /** @internal */
    public static parseBundle(model: IModel, rawBundle: Unknown | null | undefined) {
        if (!Value.hasObjectProperty(rawBundle, AssetBundle.primaryAssetName)) {
            return Value.getPropertyTypeMismatch(AssetBundle.primaryAssetName, rawBundle, {});
        }

        const asset = this.parseAsset(model, rawBundle[AssetBundle.primaryAssetName]);

        if (!(asset instanceof Asset)) {
            return asset;
        }

        return asset.bundle(rawBundle);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static parseAsset(model: IModel, rawAsset: Unknown | null | undefined) {
        if (!Value.hasStringProperty(rawAsset, Asset.typeName)) {
            return Value.getPropertyTypeMismatch(Asset.typeName, rawAsset, "");
        }

        const assetInfo = this.infos.find((info) => info.type === rawAsset.type);

        if (!assetInfo) {
            return Value.getUnknownPropertyValue(Asset.typeName, rawAsset.type);
        }

        const validationResult = assetInfo.validateAll(rawAsset);

        if (!this.hasProperties(validationResult, rawAsset)) {
            return validationResult;
        }

        return assetInfo.createAsset(model, rawAsset);
    }

    private static hasProperties(validationResult: true | string, raw: Unknown): raw is IAssetIntersection {
        return validationResult === true;
    }
}
