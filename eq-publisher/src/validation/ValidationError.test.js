const ValidationError = require("./ValidationError");

describe("validation error", () => {
  it("should accept message", () => {
    const validationError = new ValidationError("message", null);
    expect(validationError.message).toEqual("message");
  });

  it("should accept a validation object", () => {
    const mockValidationObject = {
      validationErrors: [
        {
          error: "some error",
          description: "some description"
        }
      ]
    };

    const validationError = new ValidationError(
      null,
      null,
      mockValidationObject
    );

    expect(validationError.result).toBe(mockValidationObject);
  });

  it("should override toString", () => {
    const mockValidationObject = {
      validationErrors: [
        {
          error: "some error",
          description: "some description"
        }
      ]
    };

    const validationError = new ValidationError(
      "Error message",
      {},
      mockValidationObject
    );
    const errorMessage = validationError.toString();

    expect(errorMessage).toContain("Error message");
    expect(errorMessage).toContain(JSON.stringify(mockValidationObject));
  });

  it("should override toJSON", () => {
    const mockValidationObject = {
      validationErrors: [
        {
          error: "some error",
          description: "some description"
        }
      ]
    };

    const mockQuestionnaire = {
      id: 1,
      title: "hello world"
    };

    const validationError = new ValidationError(
      "Something has gone terribly wrong",
      mockQuestionnaire,
      mockValidationObject
    );

    expect(JSON.stringify(validationError)).toMatchSnapshot();
  });
});
