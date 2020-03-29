// https://github.com/andreashuber69/net-worth#--
import { IAssetProperties } from "./IAssetProperties.schema";

export interface IAddressCryptoWalletProperties extends IAssetProperties {
    /** Provides the public address. */
    readonly address: string;
}
