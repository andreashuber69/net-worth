// https://github.com/andreashuber69/net-worth#--
import { HDNode, Network } from "@trezor/utxo-lib";
import { decode, encode } from "bs58check";
import { TaskQueue } from "./TaskQueue";

// https://github.com/andreashuber69/net-worth#--
export class FastXpub {
    public constructor(network: Network) {
        this.network = network;
    }

    public async deriveNode(xpub: string, index: number) {
        // It appears that fastxpub doesn't answer a request containing a malformed xpub, which is why we ensure the
        // correct format by creating a HDNode first.
        this.toNode(xpub);

        return FastXpub.getResponse(
            {
                type: "deriveNode",
                xpub,
                version: decode(xpub).readUInt32BE(0),
                index,
            },
            ({ data }) => data.xpub as string,
        );
    }

    public async deriveAddressRange(xpub: string, firstIndex: number, lastIndex: number) {
        const hdNode = this.toNode(xpub);

        return FastXpub.getResponse(
            {
                type: "deriveAddressRange",
                node: FastXpub.getNode(hdNode),
                firstIndex,
                lastIndex,
                version: hdNode.getNetwork().pubKeyHash,
                addressFormat: 0, // TODO
            },
            ({ data }) => data.addresses as string[],
        );
    }

    private static readonly worker = FastXpub.getWorker();
    private static readonly taskQueue = new TaskQueue();

    private static async getWorker() {
        const response = await window.fetch("fastxpub.wasm");

        if (!response.ok) {
            throw new Error(`Can't fetch: ${response.statusText}`);
        }

        const result = new Worker("fastxpub.js");

        result.postMessage({
            type: "init",
            binary: await response.arrayBuffer(),
        });

        return result;
    }

    private static getNode({ depth, index, parentFingerprint, chainCode, keyPair }: HDNode) {
        return {
            depth,
            // eslint-disable-next-line @typescript-eslint/camelcase
            child_num: index,
            fingerprint: parentFingerprint,
            // eslint-disable-next-line @typescript-eslint/camelcase
            chain_code: chainCode.slice(),
            // eslint-disable-next-line @typescript-eslint/camelcase
            public_key: keyPair.getPublicKeyBuffer().slice(),
        };
    }

    private static async getResponse<T>(message: unknown, extractResult: (ev: MessageEvent) => T) {
        const worker = await FastXpub.worker;

        return FastXpub.taskQueue.queue(
            async () => new Promise<T>((resolve, reject) => {
                FastXpub.setHandlers(worker, (ev) => resolve(extractResult(ev)), reject);
                worker.postMessage(message);
            }),
        );
    }

    private static setHandlers(worker: Worker, resolve: (ev: MessageEvent) => void, reject: (reason: Error) => void) {
        worker.onmessage = (ev) => {
            FastXpub.removeHandlers(worker);
            resolve(ev);
        };
        worker.onerror = (ev) => {
            FastXpub.removeHandlers(worker);
            reject(new Error(ev.message));
        };
    }

    private static removeHandlers(worker: Worker) {
        // The API requires null
        // eslint-disable-next-line no-null/no-null
        worker.onmessage = null;
        // eslint-disable-next-line no-null/no-null
        worker.onerror = null;
    }

    private readonly network: Network;

    private toNode(xpub: string) {
        const xpubsToTweak = ["ypub", "drkp"];

        if (xpubsToTweak.includes(xpub.slice(0, 4))) {
            const hex = `0${this.network.bip32.public.toString(16)}`;
            const converted = encode(Buffer.concat([Buffer.from(hex, "hex"), decode(xpub).slice(4)]));

            return HDNode.fromBase58(converted, this.network);
        }

        return HDNode.fromBase58(xpub, this.network);
    }
}
