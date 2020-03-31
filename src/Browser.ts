// https://github.com/andreashuber69/net-worth#--
import { UAParser } from "ua-parser-js";

export class Browser {
    public static get isCompatible() {
        const { browserName, browserVersion, engineName, engineVersion } = Browser.getInfo();

        if ((browserName === "Firefox") && (browserVersion < 47)) {
            return false;
        }

        if (((browserName === "Mobile Safari") || (browserName === "Safari")) && (browserVersion < 10)) {
            return false;
        }

        if ((browserName === "IE") || (browserName === "IEMobile")) {
            return false;
        }

        // The Blink engine is used by Chrome, Chromium and other Chromium-based browsers (like Opera and Yandex), all
        // of which have a Chrome version in their userAgent string
        if ((engineName === "Blink") && (engineVersion < 58)) {
            return false;
        }

        return true;
    }


    private static getInfo() {
        const uaParser = new UAParser();
        const { browser, engine } = uaParser.getResult();

        return {
            browserName: browser.name,
            browserVersion: Browser.getMajorVersion(browser.version),
            engineName: engine.name,
            engineVersion: Browser.getMajorVersion(engine.version),
        };
    }

    private static getMajorVersion(str: string | undefined) {
        const parsed = Number.parseInt(str ?? "", 10);

        return Number.isNaN(parsed) ? 0 : parsed;
    }
}
