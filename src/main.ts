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

// tslint:disable-next-line:no-import-side-effect no-implicit-dependencies no-submodule-imports
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify";
// tslint:disable-next-line:no-import-side-effect no-implicit-dependencies no-submodule-imports
import "vuetify/dist/vuetify.min.css";
import App from "./App.vue";
import { Browser } from "./Browser";

if (!Browser.isCompatible) {
    const appElement = document.getElementById("app");

    if (appElement) {
        appElement.innerHTML = `
            <div style="font-size:large">
                <p><strong>Asset Manager doesn't work on this browser.</strong></p>
                <p>
                    It is recommended to use Asset Manager from within a recent version of an
                    <strong>open-source</strong> browser like <strong>Chromium</strong> or <strong>Firefox</strong>.
                </p>
                <p>
                    Asset Manager should also work on recent incarnations of proprietary browsers like Chrome, Opera,
                    Safari, Edge and probably others.
                </p>
                <p>appCodeName: ${window.navigator.appCodeName}</p>
                <p>appName: ${window.navigator.appName}</p>
                <p>appVersion: ${window.navigator.appVersion}</p>
                <p>platform: ${window.navigator.platform}</p>
                <p>product: ${window.navigator.product}</p>
                <p>productSub: ${window.navigator.productSub}</p>
                <p>vendor: ${window.navigator.vendor}</p>
                <p>vendorSub: ${window.navigator.vendorSub}</p>
                <p>(${window.navigator.userAgent})</p>
            </div>
        `;
    }
} else {
    const urlComponents = window.location.href.split("?");
    const parameters = urlComponents.length === 2 ? urlComponents[1].split("&") : [];

    for (const parameter of parameters) {
        const nameValuePair = parameter.split("=");

        if (nameValuePair.length === 2) {
            window.sessionStorage.setItem(nameValuePair[0], nameValuePair[1]);
        }
    }

    if (parameters.length > 0) {
        window.location.replace(urlComponents[0]);
    } else {
        // tslint:disable:no-unsafe-any
        Vue.config.productionTip = false;
        Vue.use(Vuetify);

        new Vue({
          render: (h) => h(App),
        }).$mount("#app");
    }
}
