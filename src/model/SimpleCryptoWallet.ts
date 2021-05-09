// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { IAssetBundle } from "./Asset";
import { GenericAssetBundle } from "./GenericAssetBundle";
import { IParent } from "./IEditable";
import { IRealCryptoWalletParameters, RealCryptoWallet } from "./RealCryptoWallet";
import { ISimpleCryptoWallet, SimpleCryptoWalletTypeName } from "./validation/schemas/ISimpleCryptoWallet.schema";

/** Defines the base of all simple crypto currency wallets. */
export abstract class SimpleCryptoWallet extends RealCryptoWallet {
    public abstract get type(): SimpleCryptoWalletTypeName;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public bundle(bundle?: unknown): IAssetBundle {
        return new SimpleCryptoWallet.Bundle(this);
    }

    /** @internal */
    public toJSON(): ISimpleCryptoWallet {
        return {
            type: this.type,
            ...this.getProperties(),
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(parent: IParent, props: IRealCryptoWalletParameters) {
        super(parent, props);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly Bundle = class extends GenericAssetBundle<SimpleCryptoWallet> implements IAssetBundle {
        public toJSON() {
            return {
                primaryAsset: this.assets[0].toJSON(),
            };
        }
    };
}
