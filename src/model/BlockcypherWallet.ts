// https://github.com/andreashuber69/net-worth#--
import { IParent } from "./IEditable";
import { QueryCache } from "./QueryCache";
import { IRealCryptoWalletParameters } from "./RealCryptoWallet";
import { SimpleCryptoWallet } from "./SimpleCryptoWallet";
import { BlockcypherBalanceResponse } from "./validation/schemas/BlockcypherBalanceResponse.schema";

/** Represents a wallet the balance of which is requested from blockcypher.com. */
export abstract class BlockcypherWallet extends SimpleCryptoWallet {
    protected constructor(parent: IParent, params: IRealCryptoWalletParameters) {
        super(parent, params);
    }

    protected async queryQuantity() {
        const url = `https://api.blockcypher.com/v1/${this.unit.toLowerCase()}/main/addrs/${this.address}/balance`;
        const response = await QueryCache.fetch(url, BlockcypherBalanceResponse, { getErrorMessage: (r) => r.error });

        return (response.balance && response.balance / 1E8) ?? Number.NaN;
    }
}
