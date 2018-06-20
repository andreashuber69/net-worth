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
import { IAssetUnion, ISerializedAsset } from "./AssetInterfaces";

export class AssetGroup extends Asset {
    public get type() {
        return this.coalesce((a) => a.type) || "";
    }

    public get location() {
        return this.coalesce((a) => a.location) || "";
    }

    public get unit() {
        return this.coalesce((a) => a.unit) || "";
    }

    public get fineness() {
        return this.coalesce((a) => a.fineness);
    }

    public get quantity() {
        return (this.type && this.unit) ?
            this.assets.reduce<number | undefined>((s, a) => AssetGroup.add(s, a.quantity), 0) : undefined;
    }

    public get displayDecimals() {
        return this.coalesce((a) => a.displayDecimals) || 0;
    }

    public get totalValue() {
        return this.assets.reduce<number | undefined>((s, a) => AssetGroup.add(s, a.totalValue), 0);
    }

    public get hasActions() {
        return false;
    }

    public get interface(): IAssetUnion {
        throw new Error(`${AssetGroup.name} cannot be edited.`);
    }

    public constructor(parent: IModel, private readonly assets: Asset[]) {
        super(parent, { description: "", location: "", quantity: undefined });
    }

    // tslint:disable-next-line:prefer-function-over-method
    public toJSON(): ISerializedAsset {
        throw new Error(`${AssetGroup.name} cannot be serialized.`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static add(addend1: number | undefined, addend2: number | undefined) {
        return (addend1 === undefined) || (addend2 === undefined) ? undefined : addend1 + addend2;
    }

    private coalesce<T>(getProperty: (asset: Asset) => T): T | undefined {
        let previous: T | undefined;

        for (let index = 0; index < this.assets.length; ++index) {
            if (index === 0) {
                previous = getProperty(this.assets[index]);
            } else {
                if (getProperty(this.assets[index]) !== previous) {
                    return undefined;
                }
            }
        }

        return previous;
    }
}
