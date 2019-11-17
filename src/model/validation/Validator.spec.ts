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

import { DeletedAssets } from "./schemas/DeletedAssets.schema";
import { ValidationError } from "./ValidationError";
import { Validator } from "./Validator";

const shouldPassValidation = <T>(json: string, ctor: new (value?: unknown) => T) => {
    describe("fromJson", () => {
        describe(json, () => {
            fit("should pass validation", () => {
                expect(Validator.fromJson(json, ctor) instanceof ctor).toBe(true);
            });
        });
    });
};

const shouldFailJsonValidation = <T>(json: string, ctor: new (value?: unknown) => T, exception: Error) => {
    describe("fromJson", () => {
        describe(json, () => {
            fit(`should throw ${exception}`, () => {
                expect(() => Validator.fromJson(json, ctor)).toThrow(exception);
            });
        });
    });
};

const shouldFailValidation = <T>(data: unknown, ctor: new (value?: unknown) => T, exception: Error) => {
    describe("fromData", () => {
        describe(JSON.stringify(data), () => {
            fit(`should throw ${exception}`, () => {
                expect(() => Validator.fromData(data, ctor)).toThrow(exception);
            });
        });
    });
};

describe(Validator.name, () => {
    shouldFailJsonValidation("", DeletedAssets, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("null", DeletedAssets, new SyntaxError("data should be object"));
    shouldFailJsonValidation("[]", DeletedAssets, new ValidationError("data should be object"));
    shouldFailValidation("{}", DeletedAssets, new ValidationError("data should be object"));
    shouldFailJsonValidation(
        "{\"deletedAssets\":true}", DeletedAssets, new ValidationError("data.deletedAssets should be array"));
    shouldPassValidation("{\"deletedAssets\":[]}", DeletedAssets);
    shouldFailJsonValidation(
        "{\"deletedAssets\":[0]}", DeletedAssets, new ValidationError("data.deletedAssets[0] should be string"));
    shouldPassValidation("{\"deletedAssets\":[\"\"]}", DeletedAssets);
});
