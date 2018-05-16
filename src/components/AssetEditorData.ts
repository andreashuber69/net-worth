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

import { ICryptoWallet } from "../model/CryptoWallet";
import { IPreciousMetalAsset } from "../model/PreciousMetalAsset";
import { WeightInfo } from "./WeightInfo";

export class AssetEditorData {
    public description = "";
    public location = "";
    public address = "";
    public weight = "";
    public weightUnit = new WeightInfo("", 0);
    public fineness = "";
    public quantity  = "";

    public constructor(weightUnits: WeightInfo[], properties?: ICryptoWallet | IPreciousMetalAsset) {
        if (properties) {
            this.description = properties.description;
            this.location = properties.location;

            if (properties.tag === "pm") {
                this.weight = properties.weight.toString();
                this.weightUnit = weightUnits.find((info) => info.unit === properties.weightUnit) as WeightInfo;
                this.fineness = properties.fineness.toString();
            } else {
                this.address = properties.address;
            }

            this.quantity = properties.quantity ? properties.quantity.toString() : "";
        }
    }
}
