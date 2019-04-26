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

/**
 * Defines the common editable properties of all assets.
 * @description This interface (as well as its extending interfaces) defines the properties as they need to be provided
 * by the user as well as by the serialized form. Properties that are defined optional here are also optional in the UI
 * and during parsing. [[IAssetProperties.quantity]] is a special case since it is optional for crypto wallets but
 * required for precious metal assets.
 */
export interface IAssetProperties {
    /** Provides the asset description, e.g. 'Bars', 'Coins', 'Spending', 'Savings'. */
    readonly description: string;

    /** Provides the location of the asset, e.g. 'Safe', 'Safety Deposit Box', 'Mobile Phone', 'Hardware Wallet'. */
    readonly location?: string;

    /** Provides the asset notes. */
    readonly notes?: string;
}
