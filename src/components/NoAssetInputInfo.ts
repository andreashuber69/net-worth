// https://github.com/andreashuber69/net-worth#--
import { Asset } from "../model/Asset";
import { AssetInputInfo } from "../model/AssetInputInfo";
import { SelectInputInfo } from "../model/SelectInputInfo";
import { TextInputInfo } from "../model/TextInputInfo";

/**
 * Defines how an asset with no properties needs to be "input".
 *
 * @description This is a virtual asset that is only useful to define how the [[AssetEditor]] UI looks like when no
 * asset type has been selected yet.
 */
export class NoAssetInputInfo extends AssetInputInfo {
    public readonly type = "";
    public readonly location = new TextInputInfo();
    public readonly description = new TextInputInfo();
    public readonly address = new TextInputInfo();
    public readonly weight = new TextInputInfo();
    public readonly weightUnit = new SelectInputInfo();
    public readonly fineness = new TextInputInfo();
    public readonly value = new TextInputInfo();
    public readonly valueCurrency = new SelectInputInfo();
    public readonly quantity = new TextInputInfo();
    public readonly notes = new TextInputInfo();

    /** @internal */
    public constructor() {
        super();
    }

    // eslint-disable-next-line class-methods-use-this
    public createAsset(): Asset {
        throw new Error("Can't create asset.");
    }
}
