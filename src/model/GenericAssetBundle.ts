// https://github.com/andreashuber69/net-worth#--
import type { Asset } from "./Asset";
import type { SingleAsset } from "./SingleAsset";

/** Defines a bundle containing a single asset. */
export abstract class GenericAssetBundle<T extends SingleAsset> {
    public readonly assets: T[];

    /** @internal */
    public constructor(asset: T) {
        this.assets = [asset];
    }

    public deleteAsset(asset: Asset) {
        const index = this.assets.indexOf(asset as T);

        if (index >= 0) {
            this.assets.splice(index, 1);
        }
    }

    public async queryData() {
        await this.assets[0].queryData();
    }
}
