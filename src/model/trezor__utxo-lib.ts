// https://github.com/andreashuber69/net-worth#--
// cSpell: disable
// eslint-disable-next-line import/unambiguous
declare module "@trezor/utxo-lib" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface Network {
        readonly messagePrefix: string;
        readonly bech32?: string;
        readonly bip32: {
            readonly public: number;
            readonly private: number;
        };
        readonly pubKeyHash: number;
        readonly scriptHash: number;
        readonly wif: number;
        readonly coin: string;
    }

    // eslint-disable-next-line init-declarations
    export const networks: {
        readonly dash: Network;
        readonly dashTest: Network;
        readonly bitcoincash: Network;
        readonly bitcoincashTestnet: Network;
        readonly bitcoinsv: Network;
        readonly bitcoinsvTestnet: Network;
        readonly zcash: Network;
        readonly zcashTest: Network;
        readonly bitcoingold: Network;
        readonly litecoin: Network;
        readonly litecoinTest: Network;
        readonly bitcoin: Network;
        readonly testnet: Network;
        readonly capricoin: Network;
        readonly peercoin: Network;
        readonly peercoinTest: Network;
        readonly komodo: Network;
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface ECPair {
        getPublicKeyBuffer(): Buffer;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    export class HDNode {
        public static fromBase58(str: string, networks?: Network | Network[], skipValidation?: boolean): HDNode;

        public readonly depth: number;
        public readonly index: number;
        public readonly parentFingerprint: number;
        public readonly chainCode: Uint8Array;
        public readonly keyPair: ECPair;

        public derive(index: number): HDNode;
        public getNetwork(): Network;
        public toBase58(): string;
        public getAddress(): string;
    }
}
