// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { IAssetBundle } from "./Asset";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { IParent } from "./IEditable";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { monero } from "./validation/schemas/AssetTypeName.schema";
import { IQuantityCryptoWallet } from "./validation/schemas/IQuantityCryptoWallet.schema";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";

/** Represents a wallet for Monero. */
export class XmrWallet extends RealCryptoWallet {
    public static readonly type = monero;

    public readonly type = monero;

    public constructor(parent: IParent, props: IQuantityCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, "XMR"));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public bundle(bundle?: unknown): IAssetBundle {
        return new XmrWallet.Bundle(this);
    }

    /** @internal */
    public toJSON(): IQuantityCryptoWallet {
        return {
            type: this.type,
            ...this.getProperties(),
            quantity: this.quantity ?? 0,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly Bundle = class extends GenericAssetBundle<XmrWallet> implements IAssetBundle {
        public toJSON() {
            return {
                primaryAsset: this.assets[0].toJSON(),
            };
        }
    };
}
