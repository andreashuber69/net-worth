// https://github.com/andreashuber69/net-worth#--
import { SingleAsset } from "./SingleAsset";

/** Defines a bundle containing a single asset. */
export abstract class GenericAssetBundle<T extends SingleAsset> {
    public readonly assets: T[];

    /** @internal */
    public constructor(asset: T) {
        this.assets = [asset];
    }

    public deleteAsset(asset: T) {
        const index = this.assets.indexOf(asset);

        if (index >= 0) {
            this.assets.splice(index, 1);
        }
    }

    public async queryData() {
        return this.assets[0].queryData();
    }
}
