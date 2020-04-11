// https://github.com/andreashuber69/net-worth#--
import { Network } from "@trezor/utxo-lib";
import { FastXpub } from "./FastXpub";

export interface IBatchInfo {
    balance: number;
    txCount: number;
}

export abstract class QuantityRequest {
    public async queryQuantity() {
        // TODO: This is a crude test to distinguish between xpub and a normal address
        if (this.address.length <= 100) {
            this.quantity += (await this.getBatchInfo([this.address])).balance;
        } else {
            await Promise.all([
                this.addChain(await this.fastXpub.deriveNode(this.address, 0)),
                this.addChain(await this.fastXpub.deriveNode(this.address, 1)),
            ]);
        }

        return this.quantity;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected constructor(network: Network, private readonly address: string) {
        this.fastXpub = new FastXpub(network);
    }

    protected abstract getBatchInfo(addresses: readonly string[]): Promise<IBatchInfo>;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly batchLength = 20;
    private readonly fastXpub: FastXpub;
    private quantity = 0;

    private async addChain(xpub: string) {
        let done = false;
        let batch = await this.getBatch(xpub, 0);

        for (let index = QuantityRequest.batchLength; !done; index += QuantityRequest.batchLength) {
            // We need to do this sequentially such that we don't miss the point where unused addresses start
            // eslint-disable-next-line no-await-in-loop
            const results = await Promise.all([this.getBatchInfo(batch), this.getBatch(xpub, index)]);
            const [{ balance, txCount }] = results;
            this.quantity += balance;
            done = txCount === 0;
            [, batch] = results;
        }
    }

    private async getBatch(xpub: string, index: number) {
        return this.fastXpub.deriveAddressRange(xpub, index, index + QuantityRequest.batchLength - 1);
    }
}

