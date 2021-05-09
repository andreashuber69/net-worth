// https://github.com/andreashuber69/net-worth#--
import { Asset } from "./Asset";
import type { IParent } from "./IEditable";
import type { AssetUnion } from "./validation/schemas/AssetUnion.schema";

// This could easily be fixed by overriding abstract methods in two extending classes, but doing so seems strange at
// best. Most method implementations are trivial, so their number shouldn't matter that much.
// codebeat:disable[TOO_MANY_FUNCTIONS]
export class AssetGroup extends Asset {
    public isExpanded = false;

    // eslint-disable-next-line class-methods-use-this
    public get isExpandable() {
        return true;
    }

    public get type() {
        return this.coalesce((a) => a.type) ?? "";
    }

    public get location() {
        return this.coalesce((a) => a.location) ?? "";
    }

    public get description() {
        return this.coalesce((a) => a.description) ?? "";
    }

    public get unit() {
        return this.coalesce((a) => a.unit) ?? "";
    }

    public get fineness() {
        return this.coalesce((a) => a.fineness);
    }

    public get quantity() {
        return (this.type && this.unit) ?
            this.assets.reduce<number | undefined>((s, a) => AssetGroup.add(s, a.quantity), 0) :
            undefined;
    }

    public get quantityHint() {
        return this.coalesce((a) => a.quantityHint) ?? "";
    }

    public get displayDecimals() {
        return this.coalesce((a) => a.displayDecimals) ?? 0;
    }

    public get notes() {
        return this.assets.reduce((s, a) => `${s}${a.notes}\n`, "");
    }

    public get unitValue() {
        return this.coalesce((a) => a.unitValue);
    }

    public get unitValueHint() {
        return this.coalesce((a) => a.unitValueHint) ?? "";
    }

    public get totalValue() {
        return this.assets.reduce<number | undefined>((s, a) => AssetGroup.add(s, a.totalValue), 0);
    }

    // eslint-disable-next-line class-methods-use-this
    public get hasActions() {
        return false;
    }

    public constructor(parent: IParent, public readonly assets: Asset[]) {
        super(parent);
    }

    // eslint-disable-next-line class-methods-use-this
    public toJSON(): AssetUnion {
        throw new Error(`${AssetGroup.name} cannot be serialized.`);
    }

    /** @internal */
    public expand() {
        this.isExpanded = !this.isExpanded;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static add(addend1: number | undefined, addend2: number | undefined) {
        return (addend1 === undefined) || (addend2 === undefined) ? undefined : addend1 + addend2;
    }

    private coalesce<T>(getProperty: (asset: Asset) => T): T | undefined {
        // eslint-disable-next-line no-undef-init
        let previous: T | undefined = undefined;

        for (let index = 0; index < this.assets.length; ++index) {
            if (index === 0) {
                previous = getProperty(this.assets[index]);
            } else if (getProperty(this.assets[index]) !== previous) {
                return undefined;
            }
        }

        return previous;
    }
}
// codebeat:enable[TOO_MANY_FUNCTIONS]
