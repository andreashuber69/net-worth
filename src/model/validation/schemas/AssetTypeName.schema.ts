// https://github.com/andreashuber69/net-worth#--
export const silver = "Silver";
export const palladium = "Palladium";
export const platinum = "Platinum";
export const gold = "Gold";
export const bitcoin = "Bitcoin";
export const monero = "Monero";
export const litecoin = "Litecoin";
export const ethereumClassic = "Ethereum Classic";
export const ethereum = "Ethereum";
export const erc20Tokens = "ERC20 Tokens";
export const bitcoinGold = "Bitcoin Gold";
export const dash = "Dash";
export const zcash = "Zcash";
export const misc = "Misc";

export const assetTypeNames = [
    silver,
    palladium,
    platinum,
    gold,
    bitcoin,
    monero,
    litecoin,
    ethereumClassic,
    ethereum,
    erc20Tokens,
    bitcoinGold,
    dash,
    zcash,
    misc,
] as const;

export type AssetTypeName = typeof assetTypeNames[number];
