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

import { Model } from "./model/Model";
import { Parser } from "./Parser";

export class LocalStorage {
    public static load() {
        const localStorageKey = window.sessionStorage.getItem(LocalStorage.sessionLocalStorageKey);

        return localStorageKey ? LocalStorage.loadExistingSession(localStorageKey) : LocalStorage.loadNewSession();
    }

    public static save(model: Model) {
        // Apparently, there's no reliable way to prevent the user from closing a browser window that contains unsaved
        // changes. Both Chromium and Firefox currently refuse to show a confirmation dialog that is opened in a
        // "beforeunload" handler and the documentation for the event warns that this could be the case. Therefore, the
        // only way to prevent the loss of unsaved data is to save our data either continuously or in the "beforeunload"
        // handler. We could either save through window.localStorage or download to the users hard drive (via the same
        // mechanism as when the user invokes the "Save..." menu entry). However, the latter is bound to surprise at
        // least some users and doesn't seem to work on some browsers anyway (e.g. Firefox). Our only remaining option
        // is to therefore save to local storage.
        // Obviously, just saving to local storage under one key (e.g. "assets") only works reliably if the user
        // confines herself to not ever work with the application in more than one browser window. Since we seem to have
        // no way of preventing or detecting use in multiple browser windows, the storage mechanism must ideally satisfy
        // the following requirements:
        // 1. No committed but as of yet unsaved change in any browser window is ever lost if the user closes a tab,
        //    closes the whole browser or reloads the page at any time.
        // 2. It must be trivial to regain access to unsaved changes.
        // It appears that both requirements can be satisfied with the following mechanism:
        // - Data is always saved to local storage in a "beforeunload" handler under a monotonously increasing key,
        //   which is then also stored through window.sessionStorage.
        // - When the page loads, session storage is first checked for a saved key. If one exists, data under said key
        //   is then loaded from local storage. This ensures that the same data is always displayed
        //   before and after a page reload. If session storage does not contain a key, data under the largest key is
        //   loaded from local storage.
        // - Successfully loaded data is always *deleted* from local storage immediately. This ensures that navigating
        //   to the application in additional browser windows will never load the same data in more than one browser
        //   window.
        // The above should ensure that the application can be used much like a normal desktop application. Even if the
        // application is used in multiple tabs when the browser is closed, data in said tabs will be reloaded next
        // time the user navigates to the application in the same number of tabs/windows. This is nicely complemented
        // by the fact that many browsers have an option to automatically reload all previously open tabs when the
        // browser is started.
        // Unfortunately, the beforeunload handler doesn't seem to ever be called on Android when the user closes the
        // browser, neither on Chrome, Firefox nor Edge. Luckily, at least reload works.
        window.sessionStorage.setItem(LocalStorage.sessionLocalStorageKey, LocalStorage.saveImpl(model));
    }

    public static openNewWindow(model: Model | undefined) {
        const url = new URL(window.location.pathname, window.location.origin);
        url.searchParams.append(
            LocalStorage.sessionLocalStorageKey,
            model ? LocalStorage.saveImpl(model) : LocalStorage.emptyModelLocalStorageKey,
        );
        url.searchParams.append(LocalStorage.sessionForceLoadFromLocalStorageKey, Boolean(model).toString());
        window.open(url.href);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly emptyModelLocalStorageKey = "0";
    private static readonly sessionLocalStorageKey = "localStorageKey";
    private static readonly sessionForceLoadFromLocalStorageKey = "forceLoadFromLocalStorage";

    private static loadExistingSession(localStorageKey: string) {
        if ((localStorageKey !== LocalStorage.emptyModelLocalStorageKey) &&
            // tslint:disable-next-line:deprecation
            ((window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) ||
            (window.sessionStorage.getItem(LocalStorage.sessionForceLoadFromLocalStorageKey) === true.toString()))) {
            // Session storage can only be non-empty because the user either reloaded the page or because Open...
            // or New was clicked. Both call openNewWindow, which opens a new window with parameters attached to the
            // URL. Code in main.ts transfers any URL parameters into session storage and then uses
            // window.location.replace to reload without the parameters.
            return LocalStorage.loadModel(localStorageKey);
        }

        return new Model();
    }

    private static loadNewSession() {
        const oldKeys = LocalStorage.getOldKeys();

        // Sort the array in descending direction, so that the modified model that was last saved will be loaded.
        oldKeys.sort((l, r) => (l < r ? 1 : -1));

        for (const oldKey of oldKeys) {
            const model = LocalStorage.loadModel(oldKey.toString());

            if (model.hasUnsavedChanges) {
                // The main goal of this whole mechanism is to prevent data loss, which is why, in a new session, we
                // only ever load models that have unsaved changes. Models that have been written into a file but
                // were nevertheless later saved to local storage as part of the browser being closed do not need to
                // be considered here.
                return model;
            }
        }

        return new Model();
    }

    private static saveImpl(model: Model) {
        let key: string | undefined = LocalStorage.emptyModelLocalStorageKey;

        if (!model.assets.isEmpty) {
            const json = model.toJsonString();

            // eslint-disable-next-line no-empty
            while (!(key = LocalStorage.trySaveToLocalStorage(json))) {
            }
        }

        return key;
    }

    private static loadModel(localStorageKey: string) {
        const result = Parser.parse(window.localStorage.getItem(localStorageKey));

        if (result) {
            while (window.sessionStorage.length > 0) {
                window.sessionStorage.removeItem(window.sessionStorage.key(0) ?? "");
            }

            window.localStorage.removeItem(localStorageKey);

            return result;
        }

        return new Model();
    }

    private static trySaveToLocalStorage(json: string) {
        // We need a key that is unique and monotonously increasing. When a browser is closed with the application
        // running in multiple tabs, it is likely that two tabs will get the same value from Date.now(). The random
        // component should reduce the likelihood of a collision.
        const uniqueNumber = Math.trunc((Date.now() + Math.random()) * (2 ** 10));

        if (!Number.isSafeInteger(uniqueNumber)) {
            // Make sure all digits are significant. Since Date.now() currently returns a value with 41 binary digits,
            // adding another 10 binary digits should keep us well below the 53 binary digits commonly supported for
            // safe integers.
            throw new Error("Can't create unique key.");
        }

        const uniqueKey = uniqueNumber.toString();

        if (window.localStorage.getItem(uniqueKey)) {
            return undefined;
        }

        window.localStorage.setItem(uniqueKey, json);

        // There's still a low probability that two browser tabs arrive at the same key at the same time and an
        // overwrite happens. Verifying the written should reduce this further.
        return window.localStorage.getItem(uniqueKey) === json ? uniqueKey : undefined;
    }

    private static getOldKeys() {
        // Put all old keys into the following array.
        const result = new Array<number>();

        for (let index = 0; index < window.localStorage.length; ++index) {
            const oldKey = window.localStorage.key(index);
            // eslint-disable-next-line no-undef-init
            let oldKeyNumber: number | undefined = undefined;

            if (oldKey && (oldKeyNumber = Number.parseInt(oldKey, 10))) {
                result.push(oldKeyNumber);
            }
        }

        return result;
    }
}
