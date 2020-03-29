// https://github.com/andreashuber69/net-worth#--
import { Erc20TokensWalletBundle } from "./Erc20TokensWalletBundle";
import { IParent } from "./IEditable";
import { RealCryptoWallet } from "./RealCryptoWallet";
import { erc20Tokens } from "./validation/schemas/AssetTypeName.schema";
import { IAddressCryptoWallet } from "./validation/schemas/IAddressCryptoWallet.schema";
import { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";

/** Represents a wallet for ERC20 tokens. */
export class Erc20TokensWallet extends RealCryptoWallet {
    public static readonly type = erc20Tokens;

    public readonly type = erc20Tokens;

    public constructor(parent: IParent, props: IAddressCryptoWalletProperties) {
        super(parent, RealCryptoWallet.getProperties(props, ""));
    }

    public bundle(bundle?: unknown): Erc20TokensWalletBundle {
        return new Erc20TokensWalletBundle(this, bundle);
    }

    /** @internal */
    public toJSON(): IAddressCryptoWallet {
        return {
            type: this.type,
            ...this.getProperties(),
            address: this.address,
        };
    }
}
