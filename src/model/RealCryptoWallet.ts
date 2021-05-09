// https://github.com/andreashuber69/net-worth#--
import { CryptoCompareRequest } from "./CryptoCompareRequest";
import { CryptoWallet } from "./CryptoWallet";
import type { IParent } from "./IEditable";
import { QueryUtility } from "./QueryUtility";
import type { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";
import type { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";
import type { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

type SimpleCryptoWalletProperties = [
    ISimpleCryptoWalletProperties["location"],
    ISimpleCryptoWalletProperties["description"],
    IAddressCryptoWalletProperties["address"] | undefined,
    IQuantityCryptoWalletProperties["quantity"] | undefined,
    ISimpleCryptoWalletProperties["notes"],
];

export type IRealCryptoWalletParameters = ISimpleCryptoWalletProperties & {
    /** The crypto currency symbol, e.g. 'BTC', 'LTC'. */
    readonly currencySymbol: string;
};

/** Defines the base of all classes that represent a real crypto currency wallet. */
export abstract class RealCryptoWallet extends CryptoWallet {
    public readonly location: string;

    public readonly description: string;

    public readonly address: string;

    public readonly notes: string;

    /** @internal */
    public async queryData(): Promise<void> {
        await super.queryData();

        if (this.address) {
            const { result, status } = await QueryUtility.execute(async () => this.queryQuantity());

            if (result !== undefined) {
                this.quantity = (this.quantity === undefined ? 0 : this.quantity) + result;
            }

            this.quantityHint = status;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // This is a hack to work around the fact that the spread operator does not call property getters:
    // https://github.com/Microsoft/TypeScript/issues/26547
    protected static getProperties(
        props: ISimpleCryptoWalletProperties,
        currencySymbol: string,
    ): IRealCryptoWalletParameters {
        const { location, description, notes } = props;
        const address = (("address" in props) && props.address) || undefined;
        const quantity = (("quantity" in props) && props.quantity) || undefined;

        return {
            ...RealCryptoWallet.getPropertiesImpl([location, description, address, quantity, notes]),
            currencySymbol,
        };
    }

    protected constructor(parent: IParent, params: IRealCryptoWalletParameters) {
        super(parent, params.currencySymbol);
        this.location = params.location ?? "";
        this.description = params.description;
        this.address = (("address" in params) && params.address) || "";
        this.quantity = (("quantity" in params) && params.quantity) || undefined;
        this.notes = params.notes ?? "";
    }

    // eslint-disable-next-line class-methods-use-this
    protected async queryQuantity(): Promise<number | undefined> {
        return Promise.resolve(undefined);
    }

    protected async queryUnitValueUsd() {
        return this.unit ? new CryptoCompareRequest(this.unit, false).execute() : Promise.resolve(undefined);
    }

    /** @internal */
    protected getProperties(): ISimpleCryptoWalletProperties {
        return RealCryptoWallet.getPropertiesImpl([
            this.location || undefined,
            this.description,
            this.address || undefined,
            this.address ? undefined : this.quantity,
            this.notes || undefined,
        ]);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getPropertiesImpl(
        [location, description, address, quantity, notes]: SimpleCryptoWalletProperties,
    ): ISimpleCryptoWalletProperties {
        if (address) {
            return { location, description, address, notes };
        } else if (quantity) {
            return { location, description, quantity, notes };
        }

        throw new Error("Unexpected ISimpleCryptoWalletProperties value!");
    }
}
