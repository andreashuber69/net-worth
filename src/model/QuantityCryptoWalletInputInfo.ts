// https://github.com/andreashuber69/net-worth#--
import type { ICryptoWalletInputInfoParameters } from "./CryptoWalletInputInfo";
import { CryptoWalletInputInfo } from "./CryptoWalletInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import type { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";
import type { XmrWallet } from "./XmrWallet";

interface IQuantityCryptoWalletInputInfoParameters extends
    ICryptoWalletInputInfoParameters<XmrWallet, IQuantityCryptoWalletProperties> {
    readonly quantityDecimals: 8 | 18;
}

export class QuantityCryptoWalletInputInfo extends
    CryptoWalletInputInfo<XmrWallet, IQuantityCryptoWalletProperties> {
    public readonly address = new TextInputInfo();
    public readonly quantity: TextInputInfo;

    /** @internal */
    public constructor(parameters: IQuantityCryptoWalletInputInfoParameters) {
        super(parameters);
        this.quantity = new TextInputInfo({
            label: "Quantity",
            hint: "The amount in the wallet.",
            isPresent: true,
            isRequired: false,
            schemaName: QuantityCryptoWalletInputInfo.getSchema(parameters.quantityDecimals),
        });
    }
}
