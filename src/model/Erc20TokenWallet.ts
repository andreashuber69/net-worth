// https://github.com/andreashuber69/net-worth#--
import { CryptoWallet } from "./CryptoWallet";
import type { IEditable } from "./IEditable";
import type {
    AddressCryptoWalletTypeName,
    IAddressCryptoWallet,
} from "./validation/schemas/IAddressCryptoWallet.schema";
import type { QuantityAny } from "./validation/schemas/QuantityAny.schema";

interface ITokenWalletParameters {
    readonly editable: IErc20TokensWallet;
    readonly currencySymbol: string;
    readonly quantity: QuantityAny;
    readonly quantityHint: string;
    readonly unitValueUsd?: number;
}

export interface IErc20TokensWallet extends IEditable {
    readonly type: AddressCryptoWalletTypeName;
    readonly location: string;
    readonly description: string;
    readonly address: string;
    readonly notes: string;

    readonly queryData: () => Promise<void>;
    readonly toJSON: () => IAddressCryptoWallet;
}

export class Erc20TokenWallet extends CryptoWallet {
    public get type(): AddressCryptoWalletTypeName {
        return this.editable.type;
    }

    public get location() {
        return this.editable.location;
    }

    public get description() {
        return this.editable.description;
    }

    public get address() {
        return this.editable.address;
    }

    public get notes() {
        return this.editable.notes;
    }

    public get editableAsset() {
        return this.editable;
    }

    /** @internal */
    public constructor({ editable, currencySymbol, quantity, quantityHint, unitValueUsd }: ITokenWalletParameters) {
        super(editable.parent, currencySymbol);
        this.editable = editable;
        this.quantity = quantity;
        this.quantityHint = quantityHint;
        this.unitValueUsd = unitValueUsd;
    }

    // eslint-disable-next-line class-methods-use-this
    public toJSON(): never {
        throw new Error(`${Erc20TokenWallet.name} cannot be serialized.`);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private readonly editable: IErc20TokensWallet;
}
