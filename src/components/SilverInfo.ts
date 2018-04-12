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

import { PreciousMetalInfo, WeigthUnit } from "./PreciousMetalInfo";

/** Provides information about an asset made of silver. */
export class SilverInfo extends PreciousMetalInfo {
    public constructor(
        /** The location of the silver, e.g. Saftey Deposit Box or Home Safe. */
        location: string,
        /** Describes the asset, e.g. Bars, Coins, Medallions, ... */
        description: string,
        /** How many items are there */
        quantity: number,
        /** The weight unit to use for the denomination */
        unit: WeigthUnit,
        /** How much does a single item weigh? */
        denomination: number,
        /** The fineness, e.g. 0.999 */
        fineness: number,
    ) {
        super(location, description, "Silver", quantity, unit, denomination, fineness);
    }

    /** @internal */
    public get queries() {
        return SilverInfo.getQueriesImpl();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static * getQueriesImpl() {
        yield "https://www.quandl.com/api/v1/datasets/lbma/silver.json?rows=1";
    }
}
