// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-classes-per-file */
import type { IPrimitiveInputInfoProperties } from "./InputInfo";
import { PrimitiveInputInfo } from "./PrimitiveInputInfo";
import type { EnumSchemaName, SchemaName} from "./validation/Validator";
import { Validator } from "./validation/Validator";

interface ISelectInputInfoParameters extends IPrimitiveInputInfoProperties {
    readonly items: readonly string[];
    readonly enumSchemaNames: readonly EnumSchemaName[];
}

/** Provides input information for a property where a valid value needs to be equal to one of a given list of values. */
export abstract class SelectInputInfoBase extends PrimitiveInputInfo {
    public abstract get items(): readonly string[];

    /** @internal */
    protected constructor(props: IPrimitiveInputInfoProperties) {
        super(props);
    }
}

export class SelectInputInfo extends SelectInputInfoBase {
    public readonly items: readonly string[];

    /** @internal */
    public constructor(params = SelectInputInfo.getDefaults()) {
        super(params);
        ({ items: this.items, enumSchemaNames: this.enumSchemaNames } = params);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected validateContent(strict: boolean, input: unknown) {
        if (this.items.length && this.enumSchemaNames.length) {
            const result = this.enumSchemaNames.reduce<string | true>(
                (p: string | true, c: SchemaName) => (p === true ? p : Validator.validate(input, c)),
                "",
            );

            if (result !== true) {
                return result;
            }
        }

        return super.validateContent(strict, input);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static getDefaults(): ISelectInputInfoParameters {
        return { label: "", hint: "", isPresent: false, isRequired: false, items: [], enumSchemaNames: [] };
    }

    private readonly enumSchemaNames: readonly EnumSchemaName[];
}
