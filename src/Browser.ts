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

declare var opr: any;
declare var InstallTrigger: any;
declare var safari: any;

export class Browser {
    public static get isCompatible() {
        return this.isBlink;
    }

    // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
    // Opera 8.0+
    public static readonly isOpera =
        // tslint:disable-next-line:no-unsafe-any
        (!!(window as any).opr && !!opr.addons) || !!(window as any).opera || navigator.userAgent.indexOf(" OPR/") >= 0;

    // Firefox 1.0+
    public static readonly isFirefox = typeof InstallTrigger !== "undefined";

    // Safari 3.0+ "[object HTMLElementConstructor]"
    public static readonly isSafari =
        // tslint:disable-next-line:no-unsafe-any
        /constructor/i.test((window as any).HTMLElement) ||
        // tslint:disable-next-line:only-arrow-functions no-unsafe-any
        (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(
            // tslint:disable-next-line:no-string-literal no-unsafe-any
            !((window as any)["safari"]) || (typeof safari !== "undefined" && safari.pushNotification));

    // Internet Explorer 6-11
    // tslint:disable-next-line:binary-expression-operand-order
    public static readonly isIE = /*@cc_on!@*/false || !!(document as any).documentMode;

    // Edge 20+
    public static readonly isEdge = !Browser.isIE && !!(window as any).StyleMedia;

    // Chrome 1+
    // tslint:disable-next-line:no-unsafe-any
    public static readonly isChrome = !!(window as any).chrome && !!(window as any).chrome.webstore;

    // Blink engine detection
    public static readonly isBlink = (Browser.isChrome || Browser.isOpera) && !!(window as any).CSS;

}
