// Copyright (C) 2018-2019 Andreas Huber Dönni
//
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
// License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program. If not, see
// <http://www.gnu.org/licenses/>.

// tslint:disable-next-line: match-default-export-name
import Ajv from "ajv";

// tslint:disable-next-line: no-default-import
import schema from "./schemas/All.schema.json";
import { ValidationError } from "./ValidationError";

type PrimitiveSchemaName = "Boolean" | "Number" | "String"; // Symbol and BigInt cannot currently be represented in JSON
export type SchemaName = PrimitiveSchemaName | keyof typeof schema.definitions;

type PropertyNamesWithEnumMembers<T> = { [K in keyof T]: T[K] extends { enum: unknown[] } ? K : never }[keyof T];
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
            throw new ValidationError(Validator.ajv.errorsText());
        }

        switch (ctor as object) {
            case Boolean:
            case Number:
            case String:
                return new ctor(data);
            default:
                return Object.assign(new ctor(), data);
        }
    }

    public static validate(data: unknown, schemaName: SchemaName): true | string {
        return (Validator.ajv.validate(Validator.getSchemaKeyRef(schemaName), data) === true) ||
            Validator.ajv.errorsText();
    }

    public static getSchema(name: SchemaName) {
        return Validator.isPrimitiveSchemaName(name) ? Validator.getPrimitiveSchema(name) : schema.definitions[name];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly ajv = new Ajv({ schemas: [schema], multipleOfPrecision: 9 });

    private static getSchemaKeyRef(schemaName: SchemaName) {
        return Validator.isPrimitiveSchemaName(schemaName) ?
            Validator.getPrimitiveSchema(schemaName) : `#/definitions/${schemaName}`;
    }

    private static isSchemaName(name: string): name is SchemaName {
        return Validator.isPrimitiveSchemaName(name) || schema.definitions.hasOwnProperty(name);
    }

    private static isPrimitiveSchemaName(name: string): name is PrimitiveSchemaName {
        switch (name) {
            case "Boolean":
            case "Number":
            case "String":
                return true;
            default:
                return false;
        }
    }

    private static getPrimitiveSchema(name: PrimitiveSchemaName) {
        return { type: name.toLowerCase() };
    }
}
