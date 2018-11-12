const SchemaValidator = require("./SchemaValidator");
const ValidationError = require("./ValidationError");

describe("SchemaValidator", () => {
  let schemaValidator;
  let mockValidationApi;

  beforeEach(() => {
    mockValidationApi = {
      validate: jest.fn()
    };

    schemaValidator = new SchemaValidator(mockValidationApi);
  });

  it("should accept the validation API in its constructor", () => {
    expect(schemaValidator.validationApi).toEqual(mockValidationApi);
  });

  it("should throw error if json is invalid", async () => {
    await expect(schemaValidator.validate(undefined)).rejects.toEqual(
      expect.any(ValidationError)
    );
  });
});
