// https://github.com/andreashuber69/net-worth#--
type Price = number | null;

export class QuandlResponse {
    public readonly dataset!: {
        readonly data: readonly [
            readonly [
                string,
                ...Price[],
            ],
        ];
        readonly [key: string]: unknown;
    };
}
