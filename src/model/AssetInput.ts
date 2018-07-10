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
import { BtcWallet } from "./BtcWallet";
import { BtcWalletInputInfo } from "./BtcWalletInputInfo";
import { EthWallet } from "./EthWallet";
import { EthWalletInputInfo } from "./EthWalletInputInfo";
import { GoldAsset } from "./GoldAsset";
import { LtcWallet } from "./LtcWallet";
import { LtcWalletInputInfo } from "./LtcWalletInputInfo";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import { SilverAsset } from "./SilverAsset";
import { Unknown, Value } from "./Value";

export class AssetInput {
    /** Provides information objects for each of the supported asset types. */
    public static readonly infos: AssetInputInfo[] = [
        new BtcWalletInputInfo(BtcWallet.type, BtcWallet),
        new LtcWalletInputInfo(LtcWallet.type, LtcWallet),
        new EthWalletInputInfo(EthWallet.type, EthWallet),
        new PreciousMetalAssetInputInfo(SilverAsset.type, SilverAsset),
        new PreciousMetalAssetInputInfo(GoldAsset.type, GoldAsset),
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
            return Value.getUnknownValue(Asset.typeName, rawAsset.type);
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
