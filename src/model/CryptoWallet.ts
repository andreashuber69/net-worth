// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { SingleAsset } from "./SingleAsset";
import { AddressCryptoWalletTypeName } from "./validation/schemas/IAddressCryptoWallet.schema";
import { QuantityCryptoWalletTypeName } from "./validation/schemas/IQuantityCryptoWallet.schema";
import { SimpleCryptoWalletTypeName } from "./validation/schemas/ISimpleCryptoWallet.schema";
import { QuantityAny } from "./validation/schemas/QuantityAny.schema";

/** Defines the base of all classes that represent a crypto currency wallet. */
export abstract class CryptoWallet extends SingleAsset {
    public abstract get type(): SimpleCryptoWalletTypeName | AddressCryptoWalletTypeName | QuantityCryptoWalletTypeName;

    public get locationHint() {
        return this.address;
    }

    public abstract get address(): string;

    public get unit() {
        return this.currencySymbol;
    }

    // eslint-disable-next-line class-methods-use-this
    public get fineness() {
        return undefined;
    }

    public quantity: QuantityAny | undefined;

    public readonly displayDecimals = 6;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(parent: IParent, private readonly currencySymbol: string) {
        super(parent);
    }
}
