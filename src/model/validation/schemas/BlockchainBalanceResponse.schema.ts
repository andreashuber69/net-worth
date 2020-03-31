// https://github.com/andreashuber69/net-worth#--
export interface IAddressBalance {
    readonly [key: string]: unknown;
    // eslint-disable-next-line @typescript-eslint/camelcase
    readonly final_balance: number;
    // eslint-disable-next-line @typescript-eslint/camelcase
    readonly n_tx: number;
}

export class BlockchainBalanceResponse {
    readonly [address: string]: IAddressBalance | string | number;
}
