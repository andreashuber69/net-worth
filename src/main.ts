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

const currentUrl = new URL(window.location.href);
let hasParams = false;

// tslint:disable-next-line:no-unsafe-any
for (const key of (currentUrl.searchParams as any).keys()) {
    // tslint:disable-next-line:no-unsafe-any
    const value = currentUrl.searchParams.get(key);

    if (value) {
        // tslint:disable-next-line:no-unsafe-any
        window.sessionStorage.setItem(key, value);
        hasParams = true;
    }
}

if (hasParams) {
    window.location.replace(currentUrl.origin);
} else {
    // tslint:disable:no-unsafe-any
    Vue.config.productionTip = false;
    Vue.use(Vuetify);

    new Vue({
      render: (h) => h(App),
    }).$mount("#app");
}
