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

export class Validator {
    public static validateJson<T>(ctor: new () => T, json: string) {
        return Validator.validate(ctor, JSON.parse(json) as unknown);
    }

    public static validate<T>(ctor: new () => T, data: unknown) {
        if (!Validator.ajv.validate(`#/definitions/${ctor.name}`, data)) {
            throw new ValidationError(Validator.ajv.errorsText());
        }

        const result = new ctor();
        Object.assign(result, data);

        return result;
    }

    private static readonly ajv = new Ajv({ schemas: [schema] });
}
