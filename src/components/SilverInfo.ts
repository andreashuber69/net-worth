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
    /**
     * @param location The location of the silver, e.g. Saftey Deposit Box or Home Safe.
     * @param description Describes the asset, e.g. Bars, Coins, Medallions.
     * @param quantity The number of items.
     * @param unit The weight unit to use for the denomination.
     * @param denomination The weight of a single item.
     * @param fineness The fineness, e.g. 0.999.
     */
    public constructor(
        location: string,
        description: string,
        quantity: number,
        unit: WeigthUnit,
        denomination: number,
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
