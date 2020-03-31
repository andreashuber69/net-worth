// https://github.com/andreashuber69/net-worth#--
import packageJson from "../../package.json";

export class Application {
    public static get packageName() {
        return packageJson.name;
    }

    public static get title() {
        return Application.packageName.split("-").map((c) => `${c[0].toUpperCase()}${c.substr(1)}`).join(" ");
    }

    public static get version() {
        return packageJson.version;
    }
}
