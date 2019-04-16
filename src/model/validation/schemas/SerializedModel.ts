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

import { GroupBy } from "./GroupBy";
import { ISerializedCryptoWalletBundle } from "./ISerializedCryptoWalletBundle";
import { ISerializedErc20TokensBundle } from "./ISerializedErc20TokensBundle";
import { ISerializedMiscAssetBundle } from "./ISerializedMiscAssetBundle";
import { ISerializedPreciousMetalBundle } from "./ISerializedPreciousMetalBundle";
import { ISort } from "./ISort";

export type IBundle =
    ISerializedPreciousMetalBundle | ISerializedCryptoWalletBundle |
    ISerializedErc20TokensBundle | ISerializedMiscAssetBundle;

export class SerializedModel {
    public readonly version!: 1;
    public readonly name?: string;
    public readonly wasSavedToFile?: boolean;
    public readonly hasUnsavedChanges?: boolean;
    public readonly currency?: string;
    public readonly groupBy?: GroupBy;
    public readonly sort?: ISort;
    public readonly bundles!: IBundle[];
}
