// https://github.com/andreashuber69/net-worth#--
import { Component, Vue } from "vue-property-decorator";

import { Application } from "../model/Application";

@Component
/** Implements the About dialog. */
// eslint-disable-next-line import/no-default-export
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
        const { userAgent } = window.navigator;
        const prefix = `${Application.packageName}/`;
        const start = userAgent.indexOf(prefix) + prefix.length;

        return start >= prefix.length ? ` (Desktop v${userAgent.substring(start, userAgent.indexOf(" ", start))})` : "";
    }
}
