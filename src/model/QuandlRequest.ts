// https://github.com/andreashuber69/net-worth#--
import { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { QuandlResponse } from "./validation/schemas/QuandlResponse.schema";

/** Represents a single quandl.com request. */
export class QuandlRequest implements IWebRequest<number> {
    public constructor(private readonly path: string, private readonly invert: boolean) {
    }

    public async execute() {
        if (this.path.length > 0) {
            const url = `https://www.quandl.com/api/v3/datasets/${this.path}?api_key=ALxMkuJx2XTUqsnsn6qK&rows=1`;
            const price = (await QueryCache.fetch(url, QuandlResponse)).dataset.data[0][1] ?? Number.NaN;

            return this.invert ? 1 / price : price;
        }

        return 1;
    }
}
