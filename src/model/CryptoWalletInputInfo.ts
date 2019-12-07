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

import { IParent } from "./Asset";
import { AssetInputInfo } from "./AssetInputInfo";
import { CryptoWallet } from "./CryptoWallet";
import { SelectInputInfo } from "./SelectInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { Currency } from "./validation/schemas/Currency.schema";
import { WeightUnit } from "./validation/schemas/WeightUnit.schema";

export interface ICryptoWalletInputInfoParameters<T extends CryptoWallet, U> {
    readonly type: T["type"];
    readonly ctor: new (parent: IParent, props: U) => T;
}

export abstract class CryptoWalletInputInfo<T extends CryptoWallet, U> extends AssetInputInfo {
    public readonly type: T["type"];

    public readonly description = new TextInputInfo({
        label: "Description", hint: "Describes the wallet, e.g. 'Mycelium', 'Hardware Wallet', 'Paper Wallet'.",
        isPresent: true, isRequired: true, schemaName: "Text",
    });
    public readonly location = new TextInputInfo({
        label: "Location", hint: "The location of the wallet, e.g. 'My Mobile', 'Home', 'Safety Deposit Box'.",
        isPresent: true, isRequired: false, schemaName: "Text",
    });

    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo<typeof WeightUnit>();
    public readonly fineness = new TextInputInfo();
    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo<typeof Currency>();

    public createAsset(parent: IParent, props: U) {
        return new this.ctor(parent, props);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor({ type, ctor }: ICryptoWalletInputInfoParameters<T, U>) {
        super();
        this.type = type;
        this.ctor = ctor;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly ctor: new (parent: IParent, props: U) => T;
}
