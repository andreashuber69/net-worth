import { HDNode, Network } from "bitcoinjs-lib";


declare module "bitcoinjs-lib" {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface HDNode {
        readonly depth: number;
        readonly index: number;
        readonly parentFingerprint: number;
        readonly chainCode: Uint8Array;
    }
}

// https://github.com/andreashuber69/net-worth#--
export class FastXpub {
    public static async Create() {
        return new FastXpub(await FastXpub.wasmFile);
    }

    public async deriveNodeXpub(xpub: string, network: Network, index: number) {
        return new Promise<string>((resolve, reject) => {
            this.worker.onmessage = (ev) => resolve(ev.data.xpub as string);
            this.worker.onerror = (ev) => reject(ev.message);
            this.worker.postMessage({
                type: "deriveNode",
                xpub,
                version: network.bip32.public,
                index,
            });
        });
    }

    public async deriveAddressRange(
        node: HDNode,
        version: number,
        segwit: string | undefined,
        firstIndex: number,
        lastIndex: number,
    ) {
        const nodeCopy = {
            depth: node.depth,
            // eslint-disable-next-line @typescript-eslint/camelcase
            child_num: node.index,
            fingerprint: node.parentFingerprint,
            // eslint-disable-next-line @typescript-eslint/camelcase
            chain_code: Array.prototype.slice.call(node.chainCode),
            // eslint-disable-next-line @typescript-eslint/camelcase
            public_key: Array.prototype.slice.call(node.keyPair.getPublicKeyBuffer()),
        };

        return new Promise<string[]>((resolve, reject) => {
            this.worker.onmessage = (ev) => resolve(ev.data.addresses as string[]);
            this.worker.onerror = (ev) => reject(ev.message);
            this.worker.postMessage({
                type: "deriveAddressRange",
                node: nodeCopy,
                version,
                firstIndex,
                lastIndex,
                addressFormat: segwit === "p2sh" ? 1 : 0,
            });
        });
    }

    private static readonly wasmFile = FastXpub.getWasmFile();

    private static async getWasmFile() {
        const response = await window.fetch("fastxpub.wasm");

        if (!response.ok) {
            throw new Error(`Can't fetch: ${response.statusText}`);
        }

        return response.arrayBuffer();
    }

    private readonly worker = new Worker("fastxpub.js");

    private constructor(wasmFile: ArrayBuffer) {
        this.worker.postMessage({
            type: "init",
            binary: wasmFile,
        });
    }
}
