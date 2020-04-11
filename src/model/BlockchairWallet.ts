// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { Network } from "@trezor/utxo-lib";
import { IParent } from "./IEditable";
import { IBatchInfo, QuantityRequest } from "./QuantityRequest";
import { IFetchOptions, QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { IRealCryptoWalletParameters, RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
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

    private static readonly BlockchairQuantityRequest = class extends QuantityRequest {
        public constructor(network: Network, address: string) {
            super(network, address);
            this.urlPrefix = `https://api.blockchair.com/${this.getCoinName(network.coin)}/dashboards/addresses/`;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        protected async getBatchInfo(addresses: readonly string[]) {
            const url = `${this.urlPrefix}${addresses.join(",")}?limit=0`;

            return this.getFinalBalance(await QueryCache.fetch(url, BlockchairBalanceResponse, this.fetchOptions));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        private readonly fetchOptions: IFetchOptions<BlockchairBalanceResponse> = {
            ignoreResponseCodes: [404],
            getErrorMessage:
                ({ context: { error } }) => (error === "We couldn't find any of the addresses" ? undefined : error),
        };

        private readonly urlPrefix: string;

        // eslint-disable-next-line class-methods-use-this
        private getCoinName(coin: string) {
            switch (coin) {
                case "bch":
                    return "bitcoin-cash";
                case "bsv":
                    return "bitcoin-sv";
                case "btc":
                    return "bitcoin";
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

        private getFinalBalance({ data }: BlockchairBalanceResponse): IBatchInfo {
            if (data) {
                const result = { balance: Number.NaN, txCount: 0 };
                Object.values(data.addresses).forEach((b) => this.addBalance(result, b));

                if (Number.isNaN(result.balance)) {
                    throw new QueryError();
                }

                return result;
            }

            return { balance: 0, txCount: 0 };
        }

        // eslint-disable-next-line @typescript-eslint/camelcase, class-methods-use-this
        private addBalance(result: IBatchInfo, { balance, output_count }: IAddressInfo) {
            result.balance = (Number.isNaN(result.balance) ? 0 : result.balance) + (balance / 1E8);
            // eslint-disable-next-line @typescript-eslint/camelcase
            result.txCount += output_count;
        }
    };

    private readonly network: Network;
}
