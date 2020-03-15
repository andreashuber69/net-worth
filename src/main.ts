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

import { Browser } from "./Browser";
import { Application } from "./model/Application";

if (Browser.isCompatible) {
    if (window.location.search) {
        new URLSearchParams(window.location.search).forEach((value, key) => window.sessionStorage.setItem(key, value));
        window.location.replace(new URL(window.location.pathname, window.location.origin).href);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-unassigned-import, global-require
        require("./app-main");
    }
} else {
    const appElement = document.getElementById("app");

    if (appElement) {
        appElement.innerHTML = `
            <div class="base-page incompatible-browser-page">
                <span><strong>${Application.title} doesn't work on this browser.</strong></span>
                <span>
                    It is recommended to use ${Application.title} from within a recent version of an
                    <strong>open-source</strong> browser like Iron, Brave or Firefox. ${Application.title} should also
                    work on recent incarnations of proprietary browsers like Chrome, Opera, Safari, Edge and probably
                    others.
                </span>
                <span>${Application.title} ${Application.version}</span>
                <span>${window.navigator.userAgent}</span>
            </div>
        `;
    }
}
