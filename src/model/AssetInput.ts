// https://github.com/andreashuber69/net-worth#--
import { AssetInputInfo } from "./AssetInputInfo";
import { ObjectConverter } from "./ObjectConverter";

export class AssetInput {
    /** Provides information objects for each of the supported asset types. */
    public static readonly infos: typeof ObjectConverter.infos & { [key: string]: AssetInputInfo | undefined } = {
        ...ObjectConverter.infos,
    };
}
