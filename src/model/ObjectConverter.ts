// https://github.com/andreashuber69/net-worth#--
import { AddressCryptoWalletInputInfo } from "./AddressCryptoWalletInputInfo";
import { BtcWallet } from "./BtcWallet";
import { BtgWallet } from "./BtgWallet";
import { DashWallet } from "./DashWallet";
import { Erc20TokensWallet } from "./Erc20TokensWallet";
import { EtcWallet } from "./EtcWallet";
import { EthWallet } from "./EthWallet";
import { GoldAsset } from "./GoldAsset";
import { LtcWallet } from "./LtcWallet";
import { MiscAsset } from "./MiscAsset";
import { MiscAssetInputInfo } from "./MiscAssetInputInfo";
import { PalladiumAsset } from "./PalladiumAsset";
import { PlatinumAsset } from "./PlatinumAsset";
import { PreciousMetalAssetInputInfo } from "./PreciousMetalAssetInputInfo";
import { QuantityCryptoWalletInputInfo } from "./QuantityCryptoWalletInputInfo";
import { SilverAsset } from "./SilverAsset";
import { SimpleCryptoWalletInputInfo } from "./SimpleCryptoWalletInputInfo";
import type { IAddressCryptoObject } from "./validation/schemas/IAddressCryptoWallet.schema";
import { addressCryptoWalletTypeNames } from "./validation/schemas/IAddressCryptoWallet.schema";
import type { IMiscObject } from "./validation/schemas/IMiscAsset.schema";
import { miscAssetTypeNames } from "./validation/schemas/IMiscAsset.schema";
import type { IPreciousMetalObject } from "./validation/schemas/IPreciousMetalAsset.schema";
import { preciousMetalAssetTypeNames } from "./validation/schemas/IPreciousMetalAsset.schema";
import type { IQuantityCryptoObject } from "./validation/schemas/IQuantityCryptoWallet.schema";
import { quantityCryptoWalletTypeNames } from "./validation/schemas/IQuantityCryptoWallet.schema";
import type { ISimpleCryptoObject } from "./validation/schemas/ISimpleCryptoWallet.schema";
import { simpleCryptoWalletTypeNames } from "./validation/schemas/ISimpleCryptoWallet.schema";
import type { ObjectUnion } from "./validation/schemas/ObjectUnion.schema";
import { XmrWallet } from "./XmrWallet";
import { ZecWallet } from "./ZecWallet";

const getXpubSupportedMessage =
    // eslint-disable-next-line max-len
    (xpub: string, domain: string) => `The wallets public address (single or Trezor ${xpub}). Only single addresses will be sent to ${domain} to query the balance (a ${xpub} is split into single addresses beforehand).`;
const getXpubNotSupportedMessage =
    // eslint-disable-next-line max-len
    (domain: string) => `The wallets single public address (xpub is not supported). Will be sent to ${domain} to query the balance.`;

const btcHint = getXpubSupportedMessage("xpub/ypub", "blockchair.com");
const ltcHint = getXpubSupportedMessage("Ltub/Mtub", "blockchair.com");
const etcHint = getXpubNotSupportedMessage("blockscout.com");
const ethHint = getXpubNotSupportedMessage("ethplorer.io");
const btgHint = getXpubSupportedMessage("xpub/ypub", "bitcoingold.org");
const dashHint = getXpubSupportedMessage("drkp", "blockchair.com");
const zecHint = getXpubSupportedMessage("xpub", "blockchair.com");

type Converters<P, S, A, Q, M, PR, SR, AR, QR, MR> = readonly [
    (value: P, info: PreciousMetalAssetInputInfo) => PR,
    (value: S, info: SimpleCryptoWalletInputInfo) => SR,
    (value: A, info: AddressCryptoWalletInputInfo) => AR,
    (value: Q, info: QuantityCryptoWalletInputInfo) => QR,
    (value: M, info: MiscAssetInputInfo) => MR,
];

export class ObjectConverter {
    public static readonly infos = {
        [SilverAsset.type]: new PreciousMetalAssetInputInfo(SilverAsset),
        [PalladiumAsset.type]: new PreciousMetalAssetInputInfo(PalladiumAsset),
        [PlatinumAsset.type]: new PreciousMetalAssetInputInfo(PlatinumAsset),
        [GoldAsset.type]: new PreciousMetalAssetInputInfo(GoldAsset),
        [BtcWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: BtcWallet, addressHint: btcHint, quantityDecimals: 8 }),
        [XmrWallet.type]: new QuantityCryptoWalletInputInfo({ ctor: XmrWallet, quantityDecimals: 8 }),
        [LtcWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: LtcWallet, addressHint: ltcHint, quantityDecimals: 8 }),
        [EtcWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: EtcWallet, addressHint: etcHint, quantityDecimals: 18 }),
        [Erc20TokensWallet.type]: new AddressCryptoWalletInputInfo({ ctor: Erc20TokensWallet, addressHint: ethHint }),
        [EthWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: EthWallet, addressHint: ethHint, quantityDecimals: 18 }),
        [BtgWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: BtgWallet, addressHint: btgHint, quantityDecimals: 8 }),
        [DashWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: DashWallet, addressHint: dashHint, quantityDecimals: 8 }),
        [ZecWallet.type]:
            new SimpleCryptoWalletInputInfo({ ctor: ZecWallet, addressHint: zecHint, quantityDecimals: 8 }),
        [MiscAsset.type]: new MiscAssetInputInfo(),
    } as const;

    public static convert<
        P extends IPreciousMetalObject,
        S extends ISimpleCryptoObject,
        A extends IAddressCryptoObject,
        Q extends IQuantityCryptoObject,
        M extends IMiscObject,
        PR, SR, AR, QR, MR,
    >(
        rawObject: A | M | P | Q | S,
        [
            convertPreciousMetalObject,
            convertSimpleCryptoObject,
            convertAddressCryptoObject,
            convertQuantityCryptoObject,
            convertMiscObject,
            // This is a false positive.
            // eslint-disable-next-line array-bracket-newline
        ]: Converters<P, S, A, Q, M, PR, SR, AR, QR, MR>,
    ) {
        // TODO: This is rather unwieldy. Once we switch over to schema-based validation completely, some of this should
        // go away...
        if (ObjectConverter.is<P>(rawObject, preciousMetalAssetTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertPreciousMetalObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<S>(rawObject, simpleCryptoWalletTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertSimpleCryptoObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<A>(rawObject, addressCryptoWalletTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertAddressCryptoObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<Q>(rawObject, quantityCryptoWalletTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertQuantityCryptoObject(rawObject, info)] as const;
        } else if (ObjectConverter.is<M>(rawObject, miscAssetTypeNames)) {
            const info = ObjectConverter.infos[rawObject.type];

            return [info, convertMiscObject(rawObject, info)] as const;
        }

        return ObjectConverter.assertUnreachable(rawObject);
    }

    public static is<T extends ObjectUnion>(
        rawObject: ObjectUnion,
        types: ReadonlyArray<T["type"]>,
    ): rawObject is T {
        return types.includes(rawObject.type);
    }

    private static assertUnreachable(value: never): never {
        throw new Error(value);
    }
}
