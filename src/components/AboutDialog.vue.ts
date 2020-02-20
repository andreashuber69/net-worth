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

import { Component, Vue } from "vue-property-decorator";

import { Application } from "../model/Application";

@Component
/** Implements the About dialog. */
// tslint:disable-next-line:no-default-export
export default class AboutDialog extends Vue {
    public isOpen = false;

    public get title() {
        return `${Application.title} v${Application.version}${this.desktopVersion}`;
    }

    public get packageName() {
        return Application.packageName + (this.userAgent.includes("Electron") ? "-desktop" : "");
    }

    // eslint-disable-next-line class-methods-use-this
    public get userAgent() {
        return window.navigator.userAgent;
    }

    public showDialog() {
        this.isOpen = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // eslint-disable-next-line class-methods-use-this
    private get desktopVersion() {
        const userAgent = window.navigator.userAgent;
        const prefix = `${Application.packageName}/`;
        const start = userAgent.indexOf(prefix) + prefix.length;

        return start >= prefix.length ? ` (Desktop v${userAgent.substring(start, userAgent.indexOf(" ", start))})` : "";
    }
}
