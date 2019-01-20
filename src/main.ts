// tslint:disable:file-name-casing
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

import { Browser } from "./Browser";
import { Application } from "./model/Application";

if (Browser.isCompatible) {
    if (window.location.search) {
        new URLSearchParams(window.location.search).forEach((value, key) => window.sessionStorage.setItem(key, value));
        window.location.replace(window.location.origin);
    } else {
        // tslint:disable-next-line:no-require-imports no-var-requires
        require("./app-main");
    }
} else {
    const appElement = document.getElementById("app");

    if (appElement) {
        appElement.innerHTML = `
            <div style="padding: 20px; font-size:large">
                <p><strong>${Application.title} doesn't work on this browser.</strong></p>
                <p>
                    It is recommended to use ${Application.title} from within a recent version of an
                    <strong>open-source</strong> browser like <strong>Chromium</strong> or <strong>Firefox</strong>.
                </p>
                <p>
                    ${Application.title} should also work on recent incarnations of proprietary browsers like Chrome,
                    Opera, Safari, Edge and probably others.
                </p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p><strong>${Application.title} ${Application.version}</strong></p>
                <p>userAgent: ${window.navigator.userAgent}</p>
                <p>isOpera: ${Browser.isOpera}</p>
                <p>isFirefox: ${Browser.isFirefox}</p>
                <p>isSafari: ${Browser.isSafari}</p>
                <p>isIE: ${Browser.isIE}</p>
                <p>isEdge: ${Browser.isEdge}</p>
                <p>isChrome: ${Browser.isChrome}</p>
                <p>isBlink: ${Browser.isBlink}</p>
            </div>
        `;
    }
}
