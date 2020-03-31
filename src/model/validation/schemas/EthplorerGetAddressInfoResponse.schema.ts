// https://github.com/andreashuber69/net-worth#--
export interface IToken {
    readonly [key: string]: unknown;
    readonly tokenInfo: {
        readonly [key: string]: unknown;
        readonly symbol: string;
        readonly decimals: string | number;
        readonly price: false | {
            readonly [key: string]: unknown;
            readonly rate: number;
            readonly currency: "USD";
        };
    };

    readonly balance: number;
}

export class EthplorerGetAddressInfoResponse {
    readonly [key: string]: unknown;
    public readonly ETH?: {
        readonly [key: string]: unknown;
        readonly balance: number;
    };

    public readonly error?: {
        readonly [key: string]: unknown;
        readonly message: string;
    };

    public readonly tokens?: readonly IToken[];
}
