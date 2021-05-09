// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { Network } from "@trezor/utxo-lib";
import { IParent } from "./IEditable";
import { QuantityRequest } from "./QuantityRequest";
import { IFetchOptions, QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { IRealCryptoWalletParameters, RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { TaskQueue } from "./TaskQueue";
import { BlockchairBalanceResponse, IAddressInfo } from "./validation/schemas/BlockchairBalanceResponse.schema";
import { ISimpleCryptoWalletProperties } from "./validation/schemas/ISimpleCryptoWalletProperties.schema";

export type IBlockchairWalletParameters = IRealCryptoWalletParameters & {
    readonly network: Network;
};

/** Represents a wallet the balance of which is requested from blockchair.com. */
export abstract class BlockchairWallet extends SimpleCryptoWallet {
    // This is a hack to work around the fact that the spread operator does not call property getters:
    // https://github.com/Microsoft/TypeScript/issues/26547
    protected static getParameters(
        props: ISimpleCryptoWalletProperties,
        network: Network,
    ): IBlockchairWalletParameters {
        return { ...RealCryptoWallet.getProperties(props, network.coin.toUpperCase()), network };
    }

    protected constructor(parent: IParent, props: IBlockchairWalletParameters) {
        super(parent, props);
        this.network = props.network;
    }

    protected async queryQuantity() {
        return new BlockchairWallet.BlockchairQuantityRequest(this.network, this.address).queryQuantity();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly BlockchairQuantityRequest = class extends QuantityRequest {
        public constructor(network: Network, address: string) {
            super(network, address);
            this.urlPrefix = `https://api.blockchair.com/${this.Class.getCoinName(network.coin)}/dashboards/addresses/`;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        protected async getOutputInfos(addresses: readonly string[]) {
            const url = `${this.urlPrefix}${addresses.join(",")}?limit=0`;
            const { data } = await this.Class.taskQueue.queue(async () => this.fetch(url));

            if (!data) {
                return [{ balance: 0, txCount: 0 }];
            }

            // TODO: The type declaration should not be necessary here
            const addressInfos: IAddressInfo[] = Object.values(data.addresses);

            if (addressInfos.length === 0) {
                throw new QueryError("Unexpected empty addresses object.");
            }

            // eslint-disable-next-line @typescript-eslint/naming-convention
            return addressInfos.map(({ balance, output_count }) => ({ balance: balance / 1E8, txCount: output_count }));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private static readonly taskQueue = new TaskQueue();
        private static readonly fetchOptions: IFetchOptions<BlockchairBalanceResponse> = {
            ignoreResponseCodes: [404],
            getErrorMessage:
                ({ context: { error } }) => (error === "We couldn't find any of the addresses" ? undefined : error),
        };

        // eslint-disable-next-line class-methods-use-this
        private static getCoinName(coin: string) {
            switch (coin) {
                case "btc":
                    return "bitcoin";
                case "bch":
                    return "bitcoin-cash";
                case "bsv":
                    return "bitcoin-sv";
                case "ltc":
                    return "litecoin";
                case "zec":
                    return "zcash";
                case "dash":
                    return "dash";
                default:
                    throw new Error(`Unsupported coin: ${coin}`);
            }
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        private readonly Class = BlockchairWallet.BlockchairQuantityRequest;
        private readonly urlPrefix: string;

        private async fetch(url: string) {
            const start = new Date().getTime();

            try {
                return await QueryCache.fetch(url, BlockchairBalanceResponse, this.Class.fetchOptions);
            } finally {
                const minMillisecondsBetweenRequests = 2000;
                const waitTime = minMillisecondsBetweenRequests - (new Date().getTime() - start);

                if (waitTime > 0) {
                    await new Promise((resolve) => setTimeout(resolve, waitTime));
                }
            }
        }
    };

    private readonly network: Network;
}
