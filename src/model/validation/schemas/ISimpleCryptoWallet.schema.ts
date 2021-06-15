// https://github.com/andreashuber69/net-worth#--
import { bitcoin, bitcoinGold, dash, ethereum, ethereumClassic, litecoin, zcash } from "./AssetTypeName.schema";
import type { IAddressCryptoWalletProperties } from "./IAddressCryptoWalletProperties.schema";
import type { IQuantityCryptoWalletProperties } from "./IQuantityCryptoWalletProperties.schema";

interface IAddressCryptoWalletVariant extends ISimpleCryptoObject, IAddressCryptoWalletProperties {
}

interface IQuantityCryptoWalletVariant extends ISimpleCryptoObject, IQuantityCryptoWalletProperties {
}

export const simpleCryptoWalletTypeNames =
    [bitcoin, litecoin, ethereumClassic, ethereum, bitcoinGold, dash, zcash] as const;

export type SimpleCryptoWalletTypeName = typeof simpleCryptoWalletTypeNames[number];

export interface ISimpleCryptoObject {
    readonly type: SimpleCryptoWalletTypeName;
}

export type ISimpleCryptoWallet = IAddressCryptoWalletVariant | IQuantityCryptoWalletVariant;
