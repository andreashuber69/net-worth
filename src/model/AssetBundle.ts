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

import { Asset } from "./Asset";
import { SerializedBundleUnion } from "./validation/schemas/SerializedBundleUnion";

/**
 * Defines the base of all classes that represent a bundle of assets.
 * @description Asset bundles are primarily useful in conjunction with crypto currencies, where one address can hold a
 * balance of multiple currencies. For example, an ETH address can hold balances of hundreds of ERC20 tokens. A bundle
 * of assets is always defined by a primary asset, the details of which are then used to retrieve information about
 * secondary assets. For example, in the case of ERC20 tokens, a [[Erc20TokensWallet]] object is the primary asset
 * and the nested [[Erc20TokenWallet]] objects are the secondary assets. When the former is instantiated with an address
 * and then put into a bundle by calling [[Erc20TokensWallet.bundle]], [[Erc20TokenWallet]] objects are automatically
 * added to [[assets]] for each of the ERC20 tokens.
 * Since every asset must reside in a bundle, there is also the class [[GenericAssetBundle]], which never holds
 * secondary assets besides the primary one. This is used for all [[PreciousMetalAsset]] subclasses and other
 * [[CryptoWallet]] subclasses.
 */
export abstract class AssetBundle {
    public static readonly primaryAssetName = "primaryAsset";

    /** Provides the bundled assets (primary and secondary). */
    public abstract get assets(): Asset[];

    /** Deletes `asset` from [[assets]]. If `asset` is the primary asset, all secondary assets are deleted as well. */
    public abstract deleteAsset(asset: Asset): void;

    /** @internal */
    public abstract queryData(): Promise<void>;

    /** @internal */
    public abstract toJSON(): SerializedBundleUnion;
}
