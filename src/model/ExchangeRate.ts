// Copyright (C) 2018-2019 Andreas Huber Dönni
//
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
// License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program. If not, see
// <http://www.gnu.org/licenses/>.

import { CoinMarketCapRequest } from "./CoinMarketCapRequest";
import { IWebRequest } from "./IWebRequest";
import { QuandlRequest } from "./QuandlRequest";
import { Currency } from "./validation/schemas/Currency.schema";

export class ExchangeRate {
    public static get(currency: Currency) {
        const request = ExchangeRate.currencyMap.get(currency);

        if (!request) {
            throw new Error("Unknown currency!");
        }

        return request.execute();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly currencyMap = new Map<Currency, IWebRequest<number>>([
        // cSpell:ignore xudladd, xudlcdd, xudlbk, xudlsfd, xudldkd, xudlgbd, xudlhdd, xudljyd, xudlnkd, xudlndd
        // cSpell:ignore xudlsrd, xudlskd, xudlsgd, xudltwd, xudlzrd
        [Currency.USD, new QuandlRequest("", false)],
        [Currency.AUD, new QuandlRequest("boe/xudladd.json", false)],
        [Currency.CAD, new QuandlRequest("boe/xudlcdd.json", false)],
        [Currency.CNY, new QuandlRequest("boe/xudlbk73.json", false)],
        [Currency.CHF, new QuandlRequest("boe/xudlsfd.json", false)],
        [Currency.CZK, new QuandlRequest("boe/xudlbk27.json", false)],
        [Currency.DKK, new QuandlRequest("boe/xudldkd.json", false)],
        [Currency.GBP, new QuandlRequest("boe/xudlgbd.json", false)],
        [Currency.HKD, new QuandlRequest("boe/xudlhdd.json", false)],
        [Currency.HUF, new QuandlRequest("boe/xudlbk35.json", false)],
        [Currency.INR, new QuandlRequest("boe/xudlbk64.json", false)],
        [Currency.JPY, new QuandlRequest("boe/xudljyd.json", false)],
        [Currency.KRW, new QuandlRequest("boe/xudlbk74.json", false)],
        [Currency.LTL, new QuandlRequest("boe/xudlbk38.json", false)],
        [Currency.MYR, new QuandlRequest("boe/xudlbk66.json", false)],
        [Currency.NIS, new QuandlRequest("boe/xudlbk65.json", false)],
        [Currency.NOK, new QuandlRequest("boe/xudlnkd.json", false)],
        [Currency.NZD, new QuandlRequest("boe/xudlndd.json", false)],
        [Currency.PLN, new QuandlRequest("boe/xudlbk49.json", false)],
        [Currency.RUB, new QuandlRequest("boe/xudlbk69.json", false)],
        [Currency.SAR, new QuandlRequest("boe/xudlsrd.json", false)],
        [Currency.SEK, new QuandlRequest("boe/xudlskd.json", false)],
        [Currency.SGD, new QuandlRequest("boe/xudlsgd.json", false)],
        [Currency.THB, new QuandlRequest("boe/xudlbk72.json", false)],
        [Currency.TRY, new QuandlRequest("boe/xudlbk75.json", false)],
        [Currency.TWD, new QuandlRequest("boe/xudltwd.json", false)],
        [Currency.ZAR, new QuandlRequest("boe/xudlzrd.json", false)],
        [Currency.XAG, new QuandlRequest("lbma/silver.json", true)],
        [Currency.XAU, new QuandlRequest("lbma/gold.json", true)],
        [Currency.BTC, new CoinMarketCapRequest("bitcoin", true)],
    ]);
}
