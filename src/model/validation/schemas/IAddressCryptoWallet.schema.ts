// https://github.com/andreashuber69/net-worth#--
import { erc20Tokens } from "./AssetTypeName.schema";
import { IAddressCryptoWalletProperties } from "./IAddressCryptoWalletProperties.schema";

export const addressCryptoWalletTypeNames = [erc20Tokens] as const;

export type AddressCryptoWalletTypeName = typeof addressCryptoWalletTypeNames[number];

export interface IAddressCryptoObject {
    readonly type: AddressCryptoWalletTypeName;
}

export interface IAddressCryptoWallet extends IAddressCryptoObject, IAddressCryptoWalletProperties {
}
