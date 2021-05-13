// https://github.com/andreashuber69/net-worth#--
import type { IAssetIntersection } from "./AssetInterfaces";
import type { IEditable, IParent } from "./IEditable";
import { QueryUtility } from "./QueryUtility";
import type { AssetBundleUnion } from "./validation/schemas/AssetBundleUnion.schema";
import type { AssetTypeName } from "./validation/schemas/AssetTypeName.schema";
import type { AssetUnion } from "./validation/schemas/AssetUnion.schema";
import type { Fineness } from "./validation/schemas/Fineness.schema";
import type { ICalculatedAssetProperties } from "./validation/schemas/ICalculatedAssetProperties.schema";
import type { QuantityAny } from "./validation/schemas/QuantityAny.schema";

/**
 * Represent a bundle of assets.
 *
 * @description Asset bundles are primarily useful in conjunction with crypto currencies, where one address can hold a
 * balance of multiple currencies. For example, an ETH address can hold balances of hundreds of ERC20 tokens. A bundle
 * of assets is always defined by a primary asset, the details of which are then used to retrieve information about
 * secondary assets. For example, in the case of ERC20 tokens, a [[Erc20TokensWallet]] object is the primary asset
 * and the nested [[Erc20TokenWallet]] objects are the secondary assets. When the former is instantiated with an address
 * and then put into a bundle by calling [[Erc20TokensWallet.bundle]], [[Erc20TokenWallet]] objects are automatically
 * added to [[assets]] for each of the ERC20 tokens.
 * Since every asset must reside in a bundle, there is also the class [[GenericAssetBundle]], which never holds
 * secondary assets besides the primary one. This is used for all [[PreciousMetalAsset]] subclasses and other
 * [[CryptoWallet]] subclasses.
 */
export interface IAssetBundle {
    /** Provides the bundled assets. */
    readonly assets: readonly Asset[];

    /** Deletes `asset` from [[assets]]. */
    deleteAsset(asset: Asset): void;

    /** @internal */
    readonly queryData: () => Promise<void>;

    /** @internal */
    readonly toJSON: () => AssetBundleUnion;
}

/** Defines the base of all classes that represent an asset. */
export abstract class Asset implements ICalculatedAssetProperties {
    /** Provides the unique key of the asset. */
    public readonly key = Asset.nextKey++;

    /** Provides the parent model to which this asset belongs. */
    public readonly parent: IParent;

    // eslint-disable-next-line class-methods-use-this
    public get isExpandable() {
        return false;
    }

    /** Provides the type of asset, e.g. 'Silver, 'Gold', 'Bitcoin', 'Litecoin'. */
    public abstract get type(): AssetTypeName | "";

    /** Provides the location of the asset, e.g. 'Safe', 'Safety Deposit Box', 'Mobile Phone', 'Hardware Wallet'. */
    public abstract get location(): string;

    /** Provides further information on the location. */
    // eslint-disable-next-line class-methods-use-this
    public get locationHint() {
        return "";
    }

    /** Provides the asset description, e.g. 'Bars', 'Coins', 'Spending', 'Savings'. */
    public abstract get description(): string;

    /** Provides the unit of the quantity, e.g. '1 t oz', '10 g', 'BTC'. */
    public abstract get unit(): string;

    /** Provides the fineness, e.g. 0.999. For anything other than precious metals this is always undefined. */
    public abstract get fineness(): Fineness | undefined;

    /** Provides the asset quantity. */
    public abstract get quantity(): QuantityAny | undefined;

    /** Provides the quantity query error message, if applicable. */
    public abstract get quantityHint(): string;

    /** Provides the number of decimals to format the quantity to. */
    public abstract get displayDecimals(): number;

    /** Provides the asset notes. */
    public abstract get notes(): string;

    /** @internal */
    public get unitValue() {
        return Asset.multiply(this.unitValueUsd, this.parent.exchangeRate);
    }

    /** Provides the unit value query error message, if applicable. */
    public get unitValueHint() {
        return this.unitValueHintImpl;
    }

    /** @internal */
    public get totalValue() {
        return Asset.multiply(this.quantity, this.unitValue);
    }

    /** @internal */
    public get percent() {
        return (this.totalValue === undefined) || (this.parent.assets.grandTotalValue === undefined) ?
            undefined :
            this.totalValue / this.parent.assets.grandTotalValue * 100;
    }

    /** Provides a value indicating whether the asset has any associated actions. */
    // eslint-disable-next-line class-methods-use-this
    public get hasActions() {
        return true;
    }

    /** Provides the associated asset that can be edited. */
    public get editableAsset(): IEditable {
        return this;
    }

    /** @internal */
    public async queryData(): Promise<void> {
        const { result, status } = await QueryUtility.execute(async () => this.queryUnitValueUsd());
        this.unitValueUsd = result;
        this.unitValueHintImpl = status;
    }

    /** @internal */
    public abstract toJSON(): AssetUnion;

    /** @internal */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    public bundle(bundle?: unknown): IAssetBundle {
        throw new Error("Asset cannot be bundled.");
    }

    /** @internal */
    // eslint-disable-next-line @typescript-eslint/no-empty-function, class-methods-use-this
    public expand() {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected unitValueUsd?: number;

    protected constructor(parent: IParent) {
        this.parent = parent;
    }

    // eslint-disable-next-line class-methods-use-this
    protected async queryUnitValueUsd(): Promise<number | undefined> {
        return Promise.reject(new Error("Asset cannot query unit value."));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static nextKey = 0;

    private static multiply(factor1: number | undefined, factor2: number | undefined) {
        return (factor1 === undefined) || (factor2 === undefined) ? undefined : factor1 * factor2;
    }

    private unitValueHintImpl = "";
}

export type AssetDisplayPropertyName = (keyof IAssetIntersection) | (keyof ICalculatedAssetProperties);
