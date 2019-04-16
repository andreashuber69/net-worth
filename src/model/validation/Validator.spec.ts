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

import { DeletedAssets } from "./schemas/DeletedAssets";
import { ValidationError } from "./ValidationError";
import { Validator } from "./Validator";

const shouldPassValidation = (json: string) => {
    describe(json, () => {
        it("should pass validation", () => {
            expect(Validator.validateJson(DeletedAssets, json) instanceof
                DeletedAssets).toBe(true);
        });
    });
};

const shouldFailJsonValidation = (json: string, exception: Error) => {
    describe(json, () => {
        it(`should throw ${exception}`, () => {
            expect(() => Validator.validateJson(DeletedAssets, json)).toThrow(exception);
        });
    });
};

const shouldFailValidation = (data: unknown, exception: Error) => {
    describe(JSON.stringify(data), () => {
        it(`should throw ${exception}`, () => {
            expect(() => Validator.validate(DeletedAssets, data)).toThrow(exception);
        });
    });
};

describe(Validator.name, () => {
    describe("validateJson", () => {
        shouldFailJsonValidation("", new SyntaxError("Unexpected end of JSON input"));
        shouldFailJsonValidation("null", new SyntaxError("data should be object"));
        shouldFailJsonValidation("[]", new ValidationError("data should be object"));
        shouldFailValidation("{}", new ValidationError("data should be object"));
        shouldFailJsonValidation("{\"deletedAssets\":true}", new ValidationError("data.deletedAssets should be array"));
        shouldPassValidation("{\"deletedAssets\":[]}");
        shouldFailJsonValidation(
            "{\"deletedAssets\":[0]}", new ValidationError("data.deletedAssets[0] should be string"));
        shouldPassValidation("{\"deletedAssets\":[\"\"]}");
    });
});
