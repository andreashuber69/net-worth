// https://github.com/andreashuber69/net-worth#--
import type { IAssetBundle } from "./Asset";
import type { IErc20TokensWallet } from "./Erc20TokenWallet";
import { Erc20TokenWallet } from "./Erc20TokenWallet";
import { QueryCache } from "./QueryCache";
import { QueryError } from "./QueryError";
import { DeletedAssets } from "./validation/schemas/DeletedAssets.schema";
import type { IToken } from "./validation/schemas/EthplorerGetAddressInfoResponse.schema";
import { EthplorerGetAddressInfoResponse } from "./validation/schemas/EthplorerGetAddressInfoResponse.schema";
import type { IErc20TokensWalletBundle } from "./validation/schemas/IErc20TokensWalletBundle.schema";
import { Validator } from "./validation/Validator";

export class Erc20TokensWalletBundle implements IAssetBundle {
    public readonly assets = new Array<Erc20TokenWallet>();

    public constructor(private readonly erc20Wallet: IErc20TokensWallet, bundle?: unknown) {
        try {
            this.deletedAssets = [...Validator.fromData(bundle, DeletedAssets).deletedAssets];
        } catch {
            this.deletedAssets = [];
            // Exception intentionally ignored
        }
    }

    public deleteAsset(asset: Erc20TokenWallet) {
        const index = this.assets.indexOf(asset);

        if (index >= 0) {
            this.deletedAssets.push(this.assets[index].unit);
            this.assets.splice(index, 1);
        }
    }

    public async queryData() {
        await this.erc20Wallet.queryData();

        if (!this.erc20Wallet.address) {
            return;
        }

        try {
            const url = `https://api.ethplorer.io/getAddressInfo/${this.erc20Wallet.address}?apiKey=dvoio1769GSrYx63`;
            const options = { getErrorMessage: (r: EthplorerGetAddressInfoResponse) => r.error?.message };
            const tokens = Erc20TokensWalletBundle.getTokens(
                await QueryCache.fetch(url, EthplorerGetAddressInfoResponse, options),
            );

            for (const token of tokens[0]) {
                this.addTokenWallet(token, tokens[1]);
            }
        } catch (e: unknown) {
            if (e instanceof QueryError) {
                this.addTokenWallet(Erc20TokensWalletBundle.noTokenBalance, `${e}`);
            } else {
                throw e;
            }
        }
    }

    public toJSON(): IErc20TokensWalletBundle {
        return {
            primaryAsset: this.erc20Wallet.toJSON(),
            deletedAssets: this.deletedAssets,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getTokens({ tokens }: EthplorerGetAddressInfoResponse): [readonly IToken[], string] {
        return (tokens && [tokens, ""]) || [[Erc20TokensWalletBundle.noTokenBalance], "No Token Balance Found!"];
    }

    private static get noTokenBalance(): IToken {
        return {
            balance: Number.NaN,
            tokenInfo: {
                decimals: Number.NaN,
                price: false,
                symbol: "NONE",
            },
        };
    }

    private readonly deletedAssets: string[];

    private readonly getErrorMessage = (r: EthplorerGetAddressInfoResponse) => r.error?.message;

    private addTokenWallet(token: IToken, quantityHint: string) {
        const info = token.tokenInfo;

        if (!this.deletedAssets.includes(info.symbol) && (token.balance !== 0)) {
            this.assets.push(new Erc20TokenWallet({
                editable: this.erc20Wallet,
                currencySymbol: info.symbol,
                quantity: token.balance / (10 ** Number.parseFloat(`${info.decimals}`)),
                quantityHint,
                unitValueUsd: (info.price && info.price.rate) || 0,
            }));
        }
    }
}
