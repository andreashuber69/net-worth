// https://github.com/andreashuber69/net-worth#--
import type { AssetInputInfo } from "./AssetInputInfo";
import { ObjectConverter } from "./ObjectConverter";

// TODO: Document why this type is needed
type Infos = Readonly<Record<string, AssetInputInfo | undefined>> & typeof ObjectConverter.infos;

export class AssetInput {
    /** Provides information objects for each of the supported asset types. */
    public static readonly infos: Infos = { ...ObjectConverter.infos };
}
