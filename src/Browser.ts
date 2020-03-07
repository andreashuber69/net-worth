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

import { UAParser } from "ua-parser-js";

export class Browser {
    public static get isCompatible() {
        const { browserName, browserVersion, engineName } = Browser.getInfo();

        switch (browserName) {
            case "Firefox":
                if (browserVersion < 47) {
                    return false;
                }

                break;
            case "Mobile Safari":
            case "Safari":
                if (browserVersion < 10) {
                    return false;
                }

                break;
            case "IE":
            case "IEMobile":
                return false;
            default:
                break;
        }

        // The Blink engine is used by Chrome, Chromium and other Chromium-based browsers (like Opera and Yandex), all
        // of which have a Chrome version in their userAgent string
        if ((engineName === "Blink") && (browserVersion < 54)) {
            return false;
        }

        return true;
    }


    private static getInfo() {
        const uaParser = new UAParser();
        const { browser: { name: browserName, major }, engine: { name: engineName } } = uaParser.getResult();
        const parsedMajor = Number.parseInt(major ?? "", 10);

        return {
            browserName,
            browserVersion: Number.isNaN(parsedMajor) ? 0 : parsedMajor,
            engineName,
        };
    }
}
