export enum Currency {
    BTC,
    USD,
}

export class Value {
    public constructor(
        public readonly quantity: number,
        // "g" when a weight should be represented, no special meaning for anything else.
        public readonly quantitytUnit: string,
        public readonly value: number,
        public readonly valueCurrency: Currency) { }
}
