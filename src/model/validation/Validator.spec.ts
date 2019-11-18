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

const shouldPassJsonValidation =
    <T extends object>(json: string, ctor: new (value?: unknown) => T, expected: object) => {
    describe("fromJson", () => {
        describe(json, () => {
            it("should pass JSON validation", () => {
                const actual = Validator.fromJson(json, ctor);
                expect(actual instanceof ctor).toBe(true);
                expect(actual as object).toEqual(expected);
            });
        });
    });
};

const shouldFailJsonValidation = <T>(json: string, ctor: new (value?: unknown) => T, exception: Error) => {
    describe("fromJson", () => {
        describe(json, () => {
            it(`should throw ${exception}`, () => {
                expect(() => Validator.fromJson(json, ctor)).toThrow(exception);
            });
        });
    });
};

const shouldPassValidation = <T extends object>(data: unknown, ctor: new (value?: unknown) => T, expected: object) => {
    describe("fromData", () => {
        describe(JSON.stringify(data), () => {
            it("should pass validation", () => {
                const actual = Validator.fromData(data, ctor);
                expect(actual instanceof ctor).toBe(true);
                expect(actual as object).toEqual(expected);
            });
        });
    });
};

const shouldFailValidation = <T>(data: unknown, ctor: new (value?: unknown) => T, exception: Error) => {
    describe("fromData", () => {
        describe(JSON.stringify(data), () => {
            it(`should throw ${exception}`, () => {
                expect(() => Validator.fromData(data, ctor)).toThrow(exception);
            });
        });
    });
};

fdescribe(Validator.name, () => {
    shouldFailJsonValidation("", DeletedAssets, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("null", DeletedAssets, new SyntaxError("data should be object"));
    shouldFailJsonValidation("[]", DeletedAssets, new ValidationError("data should be object"));
    shouldFailJsonValidation(
        "{\"deletedAssets\":true}", DeletedAssets, new ValidationError("data.deletedAssets should be array"));
    shouldPassJsonValidation(
        "{\"deletedAssets\":[]}", DeletedAssets, Object.assign(new DeletedAssets(), { deletedAssets: [] }));
    shouldFailJsonValidation(
        "{\"deletedAssets\":[0]}", DeletedAssets, new ValidationError("data.deletedAssets[0] should be string"));
    shouldPassJsonValidation(
        "{\"deletedAssets\":[\"\"]}", DeletedAssets, Object.assign(new DeletedAssets(), { deletedAssets: [""] }));

    shouldFailValidation(3, Boolean, new ValidationError("data should be boolean"));
    // tslint:disable-next-line: no-construct
    shouldPassValidation(false, Boolean, new Boolean(false));
    shouldFailValidation("{}", DeletedAssets, new ValidationError("data should be object"));
    shouldPassValidation(
        { deletedAssets: [] }, DeletedAssets, Object.assign(new DeletedAssets(), { deletedAssets: [] }));

    shouldFailJsonValidation("", Boolean, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("42", Boolean, new ValidationError("data should be boolean"));
    shouldFailJsonValidation("{}", Boolean, new ValidationError("data should be boolean"));
    // tslint:disable-next-line: no-construct
    shouldPassJsonValidation("true", Boolean, new Boolean(true));
    shouldFailJsonValidation("", Number, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("true", Number, new ValidationError("data should be number"));
    shouldFailJsonValidation("\"\"", Number, new ValidationError("data should be number"));
    // tslint:disable-next-line: no-construct
    shouldPassJsonValidation("42", Number, new Number(42));
    shouldFailJsonValidation("", String, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("true", String, new ValidationError("data should be string"));
    shouldFailJsonValidation("1792", String, new ValidationError("data should be string"));
    // tslint:disable-next-line: no-construct
    shouldPassJsonValidation("\"blah\"", String, new String("blah"));
});
