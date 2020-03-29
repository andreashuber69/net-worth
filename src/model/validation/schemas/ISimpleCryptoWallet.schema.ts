// https://github.com/andreashuber69/net-worth#--
import { bitcoin, bitcoinGold, dash, ethereum, ethereumClassic, litecoin, zcash } from "./AssetTypeName.schema";
import { ISimpleCryptoWalletProperties } from "./ISimpleCryptoWalletProperties.schema";

const simpleCryptoWalletTypeNames =
    [bitcoin, litecoin, ethereumClassic, ethereum, bitcoinGold, dash, zcash] as const;

type SimpleCryptoWalletTypeName = typeof simpleCryptoWalletTypeNames[number];

interface ISimpleCryptoObject {
    readonly type: SimpleCryptoWalletTypeName;
}

type ISimpleCryptoWallet = ISimpleCryptoObject & ISimpleCryptoWalletProperties;

export { simpleCryptoWalletTypeNames, SimpleCryptoWalletTypeName, ISimpleCryptoObject, ISimpleCryptoWallet };
