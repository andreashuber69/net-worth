import { HDNode } from "bitcoinjs-lib";
import { TaskQueue } from "./TaskQueue";


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
    public static async create() {
        return new FastXpub(await FastXpub.wasmFile);
    }

    public async deriveNode(node: HDNode, index: number) {
        return this.getResponse(
            {
                type: "deriveNode",
                xpub: node.toBase58(),
                version: node.getNetwork().bip32.public,
                index,
            },
            ({ data }) => data.xpub as string,
        );
    }

    public async deriveAddressRange(
        node: HDNode,
        version: number,
        segwit: string | undefined,
        firstIndex: number,
        lastIndex: number,
    ) {
        return this.getResponse(
            {
                type: "deriveAddressRange",
                node: {
                    depth: node.depth,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    child_num: node.index,
                    fingerprint: node.parentFingerprint,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    chain_code: node.chainCode.slice(),
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    public_key: node.keyPair.getPublicKeyBuffer().slice(),
                },
                version,
                firstIndex,
                lastIndex,
                addressFormat: segwit === "p2sh" ? 1 : 0,
            },
            ({ data }) => data.addresses as string[],
        );
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
    private readonly taskQueue = new TaskQueue();

    private constructor(wasmFile: ArrayBuffer) {
        this.worker.postMessage({
            type: "init",
            binary: wasmFile,
        });
    }

    private async getResponse<T>(message: unknown, extractResult: (ev: MessageEvent) => T) {
        return this.taskQueue.queue(
            async () => new Promise<T>((resolve, reject) => {
                this.worker.onmessage = (ev) => {
                    this.removeHandlers();
                    resolve(extractResult(ev));
                };

                this.worker.onerror = (ev) => {
                    this.removeHandlers();
                    reject(new Error(ev.message));
                };

                this.worker.postMessage(message);
            }),
        );
    }

    private removeHandlers() {
        // The API requires null
        // eslint-disable-next-line no-null/no-null
        this.worker.onmessage = null;
        // eslint-disable-next-line no-null/no-null
        this.worker.onerror = null;
    }
}
