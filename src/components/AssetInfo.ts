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

import { Value } from "./Value";

export abstract class AssetInfo {
    // tslint:disable-next-line:no-null-keyword
    public value: Value | null = null;

    public constructor(
        public readonly location: string,
        public readonly label: string,
        public readonly type: string,
        public readonly quantityDecimals: number,
        public readonly denomination: string,
        public readonly fineness: number | undefined) {
    }

    public abstract update(): Promise<void>;
}
