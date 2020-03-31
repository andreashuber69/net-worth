// https://github.com/andreashuber69/net-worth#--
import { install } from "offline-plugin/runtime";
import Vue from "vue";

import App from "./App.vue";
// eslint-disable-next-line import/no-unassigned-import
import "./assets/material-icons.css";
// eslint-disable-next-line import/no-unassigned-import
import "./assets/roboto-fontface.css";
import vuetify from "./plugins/vuetify";

install();
Vue.config.productionTip = false;

new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
