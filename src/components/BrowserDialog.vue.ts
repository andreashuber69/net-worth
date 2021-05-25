// https://github.com/andreashuber69/net-worth#--
import { Component, Vue } from "vue-property-decorator";

import { Application } from "../model/Application";

@Component
/** Implements the dialog informing the user about untested browsers. */
// eslint-disable-next-line import/no-default-export
export default class BrowserDialog extends Vue {
    // eslint-disable-next-line class-methods-use-this
    public get applicationTitle() {
        return Application.title;
    }

    public isOpen = !this.dontShowDialog;

    // eslint-disable-next-line class-methods-use-this
    public get dontShowDialog() {
        return !BrowserDialog.isUntestedBrowser ||
            window.localStorage.getItem(BrowserDialog.dontShowBrowserDialogName) === `${true}`;
    }

    // eslint-disable-next-line class-methods-use-this
    public set dontShowDialog(value: boolean) {
        window.localStorage.setItem(BrowserDialog.dontShowBrowserDialogName, `${value}`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly dontShowBrowserDialogName = "dontShowBrowserDialog";

    private static get isUntestedBrowser() {
        const userAgent = window.navigator.userAgent.toLowerCase();

        // cSpell: ignore crios
        return !(/firefox|electron/u).test(userAgent) &&
            (!(/chrome|crios/u).test(userAgent) || (/edge|opr\//u).test(userAgent));
    }
}
