// https://github.com/andreashuber69/net-worth#--
import type { AssetPropertyName } from "./AssetInterfaces";
import type { Input } from "./Input";
import { InputUtility } from "./Input";
import type { IPrimitiveInputInfoProperties } from "./InputInfo";
import { InputInfo } from "./InputInfo";

/** Defines the base for all classes that provide input information for a primitive value. */
export abstract class PrimitiveInputInfo extends InputInfo implements IPrimitiveInputInfoProperties {
    public readonly label: string;
    public readonly hint: string;
    public readonly isPresent: boolean;
    public readonly isRequired: boolean;

    public validate(strict: boolean, input: Input, propertyName?: AssetPropertyName) {
        return InputUtility.isComposite(input) ?
            "A composite value was provided when a primitive one was expected." :
            this.validatePrimitive(strict, input, propertyName);
    }

    public get<T extends IPrimitiveInputInfoProperties>(ctor: new() => T, propertyName?: AssetPropertyName): T {
        if (propertyName !== undefined) {
            throw new Error("The propertyName argument must be undefined for a primitive input.");
        }

        if (!(this instanceof ctor)) {
            throw new Error(`The requested type ${ctor.name} does not match the actual type.`);
        }

        return this;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** @internal */
    protected constructor(props: IPrimitiveInputInfoProperties) {
        super();
        ({ label: this.label, hint: this.hint, isPresent: this.isPresent, isRequired: this.isRequired } = props);
    }

    /** @internal */
    protected validatePrimitive(strict: boolean, input: unknown, propertyName?: AssetPropertyName) {
        if (propertyName !== undefined) {
            throw new Error("The propertyName argument must be undefined for a primitive value.");
        }

        if (!this.isPresent) {
            return true;
        }

        const definedInput = input ?? "";

        if ((typeof definedInput === "string") && (definedInput.length === 0)) {
            return this.isRequired ? "A value is required." : true;
        }

        return this.validateContent(strict, input);
    }

    /** @internal */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    protected validateContent(strict: boolean, input: unknown): string | true {
        return true;
    }
}
