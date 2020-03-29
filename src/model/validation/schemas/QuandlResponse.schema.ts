// https://github.com/andreashuber69/net-worth#--
export class QuandlResponse {
    public readonly dataset!: {
        readonly data: readonly [
            readonly [
                string,
                number | null
            ]
        ];
        readonly [key: string]: unknown;
    };
}
