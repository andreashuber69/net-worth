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

type Type = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";

export interface ISchema {
    readonly $ref?: string;
    readonly allOf?: ISchema[];
    readonly anyOf?: ISchema[];
    readonly enum?: number[] | string[] | boolean[];
    readonly items?: ISchema | ISchema[];
    readonly maximum?: number;
    readonly exclusiveMaximum?: number;
    readonly minimum?: number;
    readonly exclusiveMinimum?: number;
    readonly multipleOf?: number;
    readonly properties?: {
        [name: string]: ISchema;
    };
    readonly required?: string[];
    // TODO: string and string[] should not be necessary here ...
    readonly type?: string | string[] | Type | Type[];
}

export type SchemaName = keyof typeof schema.definitions;

export class Validator {
    public static fromJson<T>(ctor: new () => T, json: string) {
        return Validator.fromData(ctor, JSON.parse(json) as unknown);
    }

    public static fromData<T>(ctor: new () => T, data: unknown) {
        if (!Validator.isSchemaName(ctor.name)) {
            throw new Error(`Unknown schema: ${ctor.name}`);
        }

        const validationResult = Validator.validate(data, ctor.name);

        if (validationResult !== true) {
            throw new ValidationError(Validator.ajv.errorsText());
        }

        const result = new ctor();
        Object.assign(result, data);

        return result;
    }

    public static validate(data: unknown, schemaName: SchemaName): true | string {
        return !!Validator.ajv.validate(`#/definitions/${schemaName}`, data) || Validator.ajv.errorsText();
    }

    public static getSchema(name: SchemaName): ISchema {
        return schema.definitions[name];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // tslint:disable-next-line: no-unsafe-any
    private static readonly ajv = new Ajv({ schemas: [schema] });

    private static isSchemaName(name: string): name is SchemaName {
        return schema.definitions.hasOwnProperty(name);
    }
}
