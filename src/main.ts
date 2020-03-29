// https://github.com/andreashuber69/net-worth#--
import { Browser } from "./Browser";
import { Application } from "./model/Application";

if (Browser.isCompatible) {
    if (window.location.search) {
        new URLSearchParams(window.location.search).forEach((value, key) => window.sessionStorage.setItem(key, value));
        window.location.replace(new URL(window.location.pathname, window.location.origin).href);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-unassigned-import, global-require
        require("./app-main");
    }
} else {
    const appElement = document.getElementById("app");

    if (appElement) {
        appElement.innerHTML = `
            <div class="base-page incompatible-browser-page">
                <p><strong>${Application.title} doesn't work on this
                    browser.</strong></p>
                <p>It is recommended to use ${Application.title}
                    from within a recent version of an
                    <strong>open-source</strong> browser like Iron,
                    Brave or Firefox. ${Application.title} should
                    also work on recent incarnations of
                    proprietary browsers like Chrome,
                    Opera, Safari, Edge and others.</p>
                <p>${Application.title} ${Application.version}</p>
                <p>${window.navigator.userAgent}</p>
            </div>
        `;
    }
}
