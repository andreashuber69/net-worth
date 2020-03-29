// https://github.com/andreashuber69/net-worth#--
import { IAddressCryptoWalletProperties } from "./IAddressCryptoWalletProperties.schema";
import { IQuantityCryptoWalletProperties } from "./IQuantityCryptoWalletProperties.schema";

/** Contains the defining properties common to all simple crypto currency wallets. */
export type ISimpleCryptoWalletProperties = IAddressCryptoWalletProperties | IQuantityCryptoWalletProperties;
