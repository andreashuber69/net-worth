// https://github.com/andreashuber69/net-worth#--
interface IUtxo {
    [key: string]: unknown;
    readonly amount: number;
}

export class InsightUtxoResponse extends Array<IUtxo> {
    public constructor() {
        super();
        // eslint-disable-next-line max-len
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, InsightUtxoResponse.prototype);
    }
}
