// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import { Network } from "@trezor/utxo-lib";
import { IParent } from "./IEditable";
import { QuantityRequest } from "./QuantityRequest";
import { IFetchOptions, QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { IRealCryptoWalletParameters, RealCryptoWallet } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { BlockchairBalanceResponse } from "./validation/schemas/BlockchairBalanceResponse.schema";
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

        protected async getOutputInfos(addresses: readonly string[]) {
            const url = `${this.urlPrefix}${addresses.join(",")}?limit=0`;
            const { data } = await QueryCache.fetch(url, BlockchairBalanceResponse, this.fetchOptions);

            if (!data) {
                return [{ balance: 0, txCount: 0 }];
            }

            const addressInfos = Object.values(data.addresses);

            if (addressInfos.length === 0) {
                throw new QueryError("Unexpected empty addresses object.");
            }

            // eslint-disable-next-line @typescript-eslint/camelcase
            return addressInfos.map(({ balance, output_count }) => ({ balance: balance / 1E8, txCount: output_count }));
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
    };

    private readonly network: Network;
}
