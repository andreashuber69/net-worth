// https://github.com/andreashuber69/net-worth#--
import type { IAssetProperties } from "./IAssetProperties.schema";

export interface IAddressCryptoWalletProperties extends IAssetProperties {
    /** Provides the public address. */
    readonly address: string;
}
