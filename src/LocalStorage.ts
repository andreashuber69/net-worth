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

import { Model } from "./model/Model";

export class LocalStorage {
    public static readonly emptyModelLocalStorageKey = "0";
    public static readonly sessionLocalStorageKey = "localStorageKey";
    public static readonly sessionForceLoadFromLocalStorageKey = "forceLoadFromLocalStorage";

    public static load() {
        const localStorageKey = window.sessionStorage.getItem(this.sessionLocalStorageKey);

        if (localStorageKey) {
            // Existing session
            if ((localStorageKey !== this.emptyModelLocalStorageKey) &&
                // tslint:disable-next-line:deprecation
                ((window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) ||
                (window.sessionStorage.getItem(this.sessionForceLoadFromLocalStorageKey) === true.toString()))) {
                // Session storage can only be non-empty because the user either reloaded the page or because Open...
                // or New was clicked. Both call openNewWindow, which opens a new window with parameters attached to the
                // URL. Code in main.ts transfers any URL parameters into session storage and then uses
                // window.location.replace to reload without the parameters.
                return this.loadModel(localStorageKey);
            }
        } else {
            // New session
            const oldKeys = this.getOldKeys();

            // Sort the array in descending direction, so that the modified model that was last saved will be loaded.
            oldKeys.sort((l, r) => l < r ? 1 : -1);

            for (const oldKey of oldKeys) {
                const model = this.loadModel(oldKey.toString());

                if (model.hasUnsavedChanges) {
                    // The main goal of this whole mechanism is to prevent data loss, which is why, in a new session, we
                    // only ever load models that have unsaved changes. Models that have been written into a file but
                    // were nevertheless later saved to local storage as part of the browser being closed do not need to
                    // be considered here.
                    return model;
                }
            }
        }

        return new Model();
    }

    public static save(model: Model) {
        let key: string | undefined = this.emptyModelLocalStorageKey;

        if (model.groups.length > 0) {
            const json = model.toJsonString();

            // tslint:disable-next-line:no-empty
            while (!(key = this.trySaveToLocalStorage(json))) {
            }
        }

        return key;
    }

    public static openNewWindow(model: Model | undefined) {
        const localStorageKey = model ? this.save(model) : this.emptyModelLocalStorageKey;
        const urlFirstPart = `${window.location.href}?${this.sessionLocalStorageKey}=${localStorageKey}`;
        const url = `${urlFirstPart}&${this.sessionForceLoadFromLocalStorageKey}=${!!model}`;
        window.open(url);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static parse(json: string | null) {
        const model = json ? Model.parse(json) : undefined;

        if (model instanceof Model) {
            return model;
        } else if (model) {
            alert(model);
        }

        return undefined;
    }

    private static loadModel(localStorageKey: string) {
        const result = this.parse(window.localStorage.getItem(localStorageKey));

        if (result) {
            while (window.sessionStorage.length > 0) {
                window.sessionStorage.removeItem(window.sessionStorage.key(0) || "");
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
        const uniqueNumber = Math.trunc((Date.now() + Math.random()) * Math.pow(2, 10));

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

            if (oldKey) {
                const oldKeyNumber = Number.parseInt(oldKey, 10);

                if (oldKeyNumber) {
                    result.push(oldKeyNumber);
                }
            }
        }

        return result;
    }
}
