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

declare var safari: any;

export class Browser {
    public static get isCompatible() {
        // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
        // tslint:disable-next-line:no-unsafe-any
        const isSafari = /constructor/i.test((window as any).HTMLElement) ||
            // tslint:disable-next-line:only-arrow-functions no-string-literal no-unsafe-any
            (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!(window as any)["safari"] ||
            // tslint:disable-next-line:no-unsafe-any
            ((typeof safari !== "undefined") && safari.pushNotification));

        // tslint:disable-next-line:binary-expression-operand-order no-unsafe-any
        const isIE = /*@cc_on!@*/false || !!(document as any).documentMode;

        return !isSafari && !isIE;
    }
}
