// https://github.com/andreashuber69/net-worth#--
import { Model } from "./model/Model";
import { ModelParser } from "./model/ModelParser";

export class Parser {
    public static parse(json: string | null) {
        const model = json ? ModelParser.parse(json) : undefined;

        if (model instanceof Model) {
            return model;
        } else if (model) {
            // We want to see the error in the debugger.
            // eslint-disable-next-line no-alert
            alert(model);
        }

        return undefined;
    }
}
