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

import { Component, Vue } from "vue-property-decorator";
import { Application } from "../model/Application";

@Component
/** Implements the dialog informing the user about untested browsers. */
// tslint:disable-next-line:no-default-export
export default class BrowserDialog extends Vue {
    public get applicationTitle() {
        return Application.title;
    }

    /** Provides a value indicating whether the dialog is currently open. */
    public isOpen = !this.dontShowDialog;

    public get dontShowDialog() {
        return !BrowserDialog.isUntestedBrowser ||
            window.localStorage.getItem(BrowserDialog.dontShowBrowserDialogName) === true.toString();
    }

    public set dontShowDialog(value: boolean) {
        window.localStorage.setItem(BrowserDialog.dontShowBrowserDialogName, value.toString());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly dontShowBrowserDialogName = "dontShowBrowserDialog";

    private static get isUntestedBrowser() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const testedBrowsers = [ "chromium", "firefox", "electron" ];

        for (const browser of testedBrowsers) {
            if (userAgent.indexOf(browser) >= 0) {
                return false;
            }
        }

        return true;
    }
}
