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

// eslint-disable-next-line init-declarations
declare const opr: { addons: unknown } | undefined;
// eslint-disable-next-line init-declarations
declare const InstallTrigger: any;
// eslint-disable-next-line init-declarations
declare const safari: { pushNotification: object } | undefined;

declare global {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Window {
        HTMLElement?: string;
    }
}

export class Browser {
    public static get isCompatible() {
        // The following detection is accurate for desktop browsers only. For many mobile browsers, especially the ones
        // based on Chromium, this method will return true no matter what version of browser it runs on. For now, this
        // might be "good enough", as users tend to update their phones much more often than their desktop computers. A
        // phone therefore has a higher probability to come with a suitable browser.
        if (Browser.isFirefox && (Browser.getVersion(" Firefox/") < 47)) {
            return false;
        }

        if (Browser.isSafari && (Browser.getVersion(" Version/") < 10)) {
            return false;
        }

        if (Browser.isIE) {
            return false;
        }

        // Blink is true for Chrome, Chromium and other Chromium-based browsers like Opera and Yandex, all of which have
        // a Chrome version in their userAgent string
        if (Browser.isBlink && (Browser.getVersion(" Chrome/") < 54)) {
            return false;
        }

        return true;
    }

    // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser

    // Opera 8.0+
    public static readonly isOpera = (Boolean((window as any).opr) && Boolean(opr?.addons)) ||
        Boolean((window as any).opera) || navigator.userAgent.includes(" OPR/");

    // Firefox 1.0+
    public static readonly isFirefox = typeof InstallTrigger !== "undefined";

    // Safari 3.0+ "[object HTMLElementConstructor]"
    public static readonly isSafari = (/constructor/ui).test(window.HTMLElement) ||
        ((p) => p.toString() === "[object SafariRemoteNotification]")(
            !((window as any).safari) || (typeof safari !== "undefined" && safari.pushNotification),
        );

    // Internet Explorer 6-11
    public static readonly isIE = Boolean((document as any).documentMode) || false;

    // Edge 20+
    public static readonly isEdge = !Browser.isIE && Boolean((window as any).StyleMedia);

    // Chrome 1+
    // cSpell: ignore webstore
    public static readonly isChrome = Boolean((window as any).chrome) && Boolean((window as any).chrome.webstore);

    // Blink engine detection
    public static readonly isBlink = (Browser.isChrome || Browser.isOpera) && Boolean((window as any).CSS);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getVersion(versionPrefix: string) {
        const { userAgent } = window.navigator;
        const versionIndex = userAgent.indexOf(versionPrefix);

        return versionIndex >= 0 ? parseInt(userAgent.substr(versionIndex + versionPrefix.length), 10) : Number.NaN;
    }
}
