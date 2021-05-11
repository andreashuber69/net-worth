// https://github.com/andreashuber69/net-worth#--
import { DeletedAssets } from "./schemas/DeletedAssets.schema";
import { ValidationError } from "./ValidationError";
import { Validator } from "./Validator";

const shouldPassJsonValidation = <T>(
    json: string, ctor: new (value?: unknown) => T, expected: T,
) => {
    describe("fromJson", () => {
        describe(json, () => {
            it("should pass JSON validation", () => {
                const actual = Validator.fromJson(json, ctor);
                expect(actual instanceof ctor).toBe(true);
                expect(actual).toEqual(expected);
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

const shouldPassValidation = <T>(data: unknown, ctor: new (value?: unknown) => T, expected: T) => {
    describe("fromData", () => {
        describe(JSON.stringify(data), () => {
            it("should pass validation", () => {
                const actual = Validator.fromData(data, ctor);
                expect(actual instanceof ctor).toBe(true);
                expect(actual).toEqual(expected);
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

describe(Validator.name, () => {
    shouldFailJsonValidation("", DeletedAssets, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("null", DeletedAssets, new SyntaxError("data should be object"));
    shouldFailJsonValidation("[]", DeletedAssets, new ValidationError("data should be object"));
    shouldFailJsonValidation(
        "{\"deletedAssets\":true}",
        DeletedAssets,
        new ValidationError("data.deletedAssets should be array"),
    );
    shouldPassJsonValidation(
        "{\"deletedAssets\":[]}",
        DeletedAssets,
        Object.assign(new DeletedAssets(), { deletedAssets: [] }),
    );
    shouldFailJsonValidation(
        "{\"deletedAssets\":[0]}",
        DeletedAssets,
        new ValidationError("data.deletedAssets[0] should be string"),
    );
    shouldPassJsonValidation(
        "{\"deletedAssets\":[\"\"]}",
        DeletedAssets,
        Object.assign(new DeletedAssets(), { deletedAssets: [""] }),
    );

    shouldFailValidation(3, Boolean, new ValidationError("data should be boolean"));
    // eslint-disable-next-line no-new-wrappers
    shouldPassValidation(false, Boolean, new Boolean(false));
    shouldFailValidation("{}", DeletedAssets, new ValidationError("data should be object"));
    shouldPassValidation(
        { deletedAssets: [] },
        DeletedAssets,
        Object.assign(new DeletedAssets(), { deletedAssets: [] }),
    );

    shouldFailJsonValidation("", Boolean, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("42", Boolean, new ValidationError("data should be boolean"));
    shouldFailJsonValidation("{}", Boolean, new ValidationError("data should be boolean"));
    // eslint-disable-next-line no-new-wrappers
    shouldPassJsonValidation("true", Boolean, new Boolean(true));
    shouldFailJsonValidation("", Number, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("true", Number, new ValidationError("data should be number"));
    shouldFailJsonValidation("\"\"", Number, new ValidationError("data should be number"));
    // eslint-disable-next-line no-new-wrappers
    shouldPassJsonValidation("42", Number, new Number(42));
    shouldFailJsonValidation("", String, new SyntaxError("Unexpected end of JSON input"));
    shouldFailJsonValidation("true", String, new ValidationError("data should be string"));
    shouldFailJsonValidation("1792", String, new ValidationError("data should be string"));
    // eslint-disable-next-line no-new-wrappers
    shouldPassJsonValidation("\"blah\"", String, new String("blah"));
});
