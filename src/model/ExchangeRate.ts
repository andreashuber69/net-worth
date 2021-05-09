// https://github.com/andreashuber69/net-worth#--
import { CryptoCompareRequest } from "./CryptoCompareRequest";
import type { IWebRequest } from "./IWebRequest";
import { QuandlRequest } from "./QuandlRequest";
import type { CurrencyName } from "./validation/schemas/CurrencyName.schema";

export class ExchangeRate {
    public static async get(currency: CurrencyName) {
        const request = ExchangeRate.currencyMap.get(currency);

        if (!request) {
            throw new Error("Unknown currency!");
        }

        return request.execute();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly currencyMap: ReadonlyMap<CurrencyName, IWebRequest<number>> = new Map([
        // cSpell:ignore xudladd, xudlcdd, xudlbk, xudlsfd, xudldkd, xudlgbd, xudlhdd, xudljyd, xudlnkd, xudlndd
        // cSpell:ignore xudlsrd, xudlskd, xudlsgd, xudltwd, xudlzrd
        ["USD", new QuandlRequest("", false) as IWebRequest<number>],
        ["AUD", new QuandlRequest("boe/xudladd.json", false)],
        ["CAD", new QuandlRequest("boe/xudlcdd.json", false)],
        ["CNY", new QuandlRequest("boe/xudlbk73.json", false)],
        ["CHF", new QuandlRequest("boe/xudlsfd.json", false)],
        ["CZK", new QuandlRequest("boe/xudlbk27.json", false)],
        ["DKK", new QuandlRequest("boe/xudldkd.json", false)],
        ["GBP", new QuandlRequest("boe/xudlgbd.json", false)],
        ["HKD", new QuandlRequest("boe/xudlhdd.json", false)],
        ["HUF", new QuandlRequest("boe/xudlbk35.json", false)],
        ["INR", new QuandlRequest("boe/xudlbk64.json", false)],
        ["JPY", new QuandlRequest("boe/xudljyd.json", false)],
        ["KRW", new QuandlRequest("boe/xudlbk74.json", false)],
        ["LTL", new QuandlRequest("boe/xudlbk38.json", false)],
        ["MYR", new QuandlRequest("boe/xudlbk66.json", false)],
        ["NIS", new QuandlRequest("boe/xudlbk65.json", false)],
        ["NOK", new QuandlRequest("boe/xudlnkd.json", false)],
        ["NZD", new QuandlRequest("boe/xudlndd.json", false)],
        ["PLN", new QuandlRequest("boe/xudlbk49.json", false)],
        ["RUB", new QuandlRequest("boe/xudlbk69.json", false)],
        ["SAR", new QuandlRequest("boe/xudlsrd.json", false)],
        ["SEK", new QuandlRequest("boe/xudlskd.json", false)],
        ["SGD", new QuandlRequest("boe/xudlsgd.json", false)],
        ["THB", new QuandlRequest("boe/xudlbk72.json", false)],
        ["TRY", new QuandlRequest("boe/xudlbk75.json", false)],
        ["TWD", new QuandlRequest("boe/xudltwd.json", false)],
        ["ZAR", new QuandlRequest("boe/xudlzrd.json", false)],
        ["XAG", new QuandlRequest("lbma/silver.json", true)],
        ["XAU", new QuandlRequest("lbma/gold.json", true)],
        ["BTC", new CryptoCompareRequest("BTC", true)],
    ]);
}
