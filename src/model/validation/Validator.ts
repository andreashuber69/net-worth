// https://github.com/andreashuber69/net-worth#--
import Ajv from "ajv";

import schema from "./schemas/All.schema.json";
import { ValidationError } from "./ValidationError";

// These are the only non-null primitives currently allowed in JSON schema, see
// https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.4.2.1
const primitiveSchemaNames = ["Boolean", "Number", "String"] as const;
type PrimitiveSchemaName = typeof primitiveSchemaNames[number];
type PropertyNamesWithEnumMembers<T> = { [K in keyof T]: T[K] extends { enum: unknown[] } ? K : never }[keyof T];

export type SchemaName = PrimitiveSchemaName | keyof typeof schema.definitions;

export type EnumSchemaName = PropertyNamesWithEnumMembers<typeof schema.definitions>;

export class Validator {
    public static fromJson<T>(json: string, ctor: new (value?: unknown) => T): T {
        return Validator.fromData(JSON.parse(json) as unknown, ctor);
    }

    public static fromData<T>(data: unknown, ctor: new (value?: unknown) => T): T {
        if (!Validator.isSchemaName(ctor.name)) {
            throw new Error(`Unknown schema: ${ctor.name}`);
        }

        const validationResult = Validator.validate(data, ctor.name);

        if (validationResult !== true) {
            // eslint-disable-next-line no-console
            console.log(`${JSON.stringify(data, undefined, 2)} does not satisfy ${ctor.name}`);
            throw new ValidationError(validationResult);
        }

        return Validator.isPrimitiveSchemaName(ctor.name) ? new ctor(data) : Object.assign(new ctor(), data);
    }

    public static validate(data: unknown, schemaName: SchemaName): string | true {
        return (Validator.ajv.validate(Validator.getSchemaKeyRef(schemaName), data) === true) ||
            Validator.ajv.errorsText();
    }

    public static getSchema(name: SchemaName) {
        return Validator.isPrimitiveSchemaName(name) ? Validator.getPrimitiveSchema(name) : schema.definitions[name];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly customSchemaKey = "Custom";
    private static readonly ajv = Validator.createAjv();

    private static createAjv() {
        const result = new Ajv({ multipleOfPrecision: 9 });
        result.addSchema(schema, Validator.customSchemaKey);
        primitiveSchemaNames.forEach(
            (name) => result.addSchema(Validator.getPrimitiveSchema(name), Validator.getSchemaKeyRef(name)),
        );

        return result;
    }

    private static getSchemaKeyRef(schemaName: SchemaName) {
        return Validator.isPrimitiveSchemaName(schemaName) ?
            schemaName :
            `${Validator.customSchemaKey}#/definitions/${schemaName}`;
    }

    private static isSchemaName(name: string): name is SchemaName {
        return Validator.isPrimitiveSchemaName(name) || Object.prototype.hasOwnProperty.call(schema.definitions, name);
    }

    private static isPrimitiveSchemaName(name: string): name is PrimitiveSchemaName {
        return (primitiveSchemaNames as readonly string[]).includes(name);
    }

    private static getPrimitiveSchema(name: PrimitiveSchemaName) {
        return { type: name.toLowerCase() };
    }
}
