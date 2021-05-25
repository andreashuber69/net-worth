// https://github.com/andreashuber69/net-worth#--
import type { IWebRequest } from "./IWebRequest";
import { QueryCache } from "./QueryCache";
import { CryptoCompareResponse } from "./validation/schemas/CryptoCompareResponse.schema";

/** Represents a single cryptocompare.com request. */
export class CryptoCompareRequest implements IWebRequest<number> {
    public constructor(private readonly coin: string, private readonly invert: boolean) {
    }

    public async execute() {
        const price = (await QueryCache.fetch(
            `https://min-api.cryptocompare.com/data/price?fsym=${this.coin}&tsyms=USD`,
            CryptoCompareResponse,
        )).USD;

        return this.invert ? 1 / price : price;
    }
}
