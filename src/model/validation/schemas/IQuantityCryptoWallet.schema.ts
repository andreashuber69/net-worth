// https://github.com/andreashuber69/net-worth#--
import { monero } from "./AssetTypeName.schema";
import { IQuantityCryptoWalletProperties } from "./IQuantityCryptoWalletProperties.schema";

export const quantityCryptoWalletTypeNames = [monero] as const;

export type QuantityCryptoWalletTypeName = typeof quantityCryptoWalletTypeNames[number];

export interface IQuantityCryptoObject {
    readonly type: QuantityCryptoWalletTypeName;
}

export interface IQuantityCryptoWallet extends IQuantityCryptoObject, IQuantityCryptoWalletProperties {
}
