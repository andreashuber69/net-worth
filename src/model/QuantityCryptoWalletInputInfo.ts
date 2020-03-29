// https://github.com/andreashuber69/net-worth#--
import { CryptoWalletInputInfo, ICryptoWalletInputInfoParameters } from "./CryptoWalletInputInfo";
import { TextInputInfo } from "./TextInputInfo";
import { IQuantityCryptoWalletProperties } from "./validation/schemas/IQuantityCryptoWalletProperties.schema";
import { XmrWallet } from "./XmrWallet";

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
