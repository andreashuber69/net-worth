// https://github.com/andreashuber69/net-worth#--
import { AssetPropertyName } from "./AssetInterfaces";
import { Input } from "./Input";

export interface IPrimitiveInputInfoProperties {
    readonly label: string;
    readonly hint: string;
    readonly isPresent: boolean;
    readonly isRequired: boolean;
}

/**
 * Defines the base for all classes that provide input information for a primitive or composite value.
 *
 * @description Input information refers to data displayed in the UI (prompts, hints, whether a value is required, etc.)
 * as well as the means to validate input.
 */
export abstract class InputInfo {
    /**
     * Validates `input` or a property of `input`.
     *
     * @description As the type indicates, `input` can be of primitive or composite type. In the former case, `input`
     * itself is validated. In the latter case, the value of the property with the passed name is validated. Either
     * way, this method only ever validates a single primitive value.
     * @returns `true` if the property value is valid; otherwise a string describing why the value is invalid.
     */
    public abstract validate(strict: boolean, input: Input, propertyName?: AssetPropertyName): true | string;

    /**
     * Gets the input info for a property.
     *
     * @throws `Error` if `T` does not match the type implied by `propertyName`.
     */
    public abstract get<T extends IPrimitiveInputInfoProperties>(ctor: new() => T, propertyName?: AssetPropertyName): T;
}
