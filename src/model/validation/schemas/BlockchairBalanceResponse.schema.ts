// https://github.com/andreashuber69/net-worth#--
export interface IAddressInfo {
    readonly [key: string]: unknown;
    readonly balance: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly output_count: number;
}

export interface IData {
    readonly [key: string]: unknown;
    // Record<T> doesn't work here, because the schema generator is unable to deal with that
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    readonly addresses: {
        readonly [address: string]: IAddressInfo;
    };
}

export class BlockchairBalanceResponse {
    readonly [key: string]: unknown;
    public readonly data!: IData | null;
    public readonly context!: {
        readonly [key: string]: unknown;
        readonly error?: string;
    };
}
