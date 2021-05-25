// https://github.com/andreashuber69/net-worth#--
import type { ICryptoWalletInputInfoParameters } from "./CryptoWalletInputInfo";
import { CryptoWalletInputInfo } from "./CryptoWalletInputInfo";
import type { Erc20TokensWallet } from "./Erc20TokensWallet";
import { TextInputInfo } from "./TextInputInfo";
import type { IAddressCryptoWalletProperties } from "./validation/schemas/IAddressCryptoWalletProperties.schema";

interface IAddressCryptoWalletInputInfoParameters extends
    ICryptoWalletInputInfoParameters<Erc20TokensWallet, IAddressCryptoWalletProperties> {
    readonly addressHint: string;
}

export class AddressCryptoWalletInputInfo extends
    CryptoWalletInputInfo<Erc20TokensWallet, IAddressCryptoWalletProperties> {
    public readonly address: TextInputInfo;
    public readonly quantity = new TextInputInfo();

    /** @internal */
    public constructor(parameters: IAddressCryptoWalletInputInfoParameters) {
        super(parameters);
        this.address = new TextInputInfo({
            label: "Address", hint: parameters.addressHint, isPresent: true, isRequired: true, schemaName: "Text",
        });
    }
}
