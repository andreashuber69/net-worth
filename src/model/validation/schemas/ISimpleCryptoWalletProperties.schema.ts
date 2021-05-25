// https://github.com/andreashuber69/net-worth#--
import type { IAddressCryptoWalletProperties } from "./IAddressCryptoWalletProperties.schema";
import type { IQuantityCryptoWalletProperties } from "./IQuantityCryptoWalletProperties.schema";

/** Contains the defining properties common to all simple crypto currency wallets. */
export type ISimpleCryptoWalletProperties = IAddressCryptoWalletProperties | IQuantityCryptoWalletProperties;
