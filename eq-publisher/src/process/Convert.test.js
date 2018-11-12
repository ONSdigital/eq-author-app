const ValidationError = require("../validation/ValidationError");
const Convert = require("./Convert");

const result = {
  data: {
    questionnaire: {
      id: 1,
      metadata: [],
      sections: [
        {
          id: 1,
          pages: [
            {
              id: 1,
              answers: [
                {
                  id: 1,
                  type: "TextField",
                  properties: { required: true }
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

describe("Convert", () => {
  let convert;
  let mockSchemaValidator;

  beforeEach(() => {
    mockSchemaValidator = {
      validate: jest.fn()
    };
    convert = new Convert(mockSchemaValidator);
  });

  describe("constructor", () => {
    it("expects a schema validator", () => {
      expect(() => new Convert()).toThrow();
    });

    it("should set schema validator as property", () => {
      expect(convert.schemaValidator).toBe(mockSchemaValidator);
    });
  });

  describe("behaviour", () => {
    beforeEach(async () => {
      mockSchemaValidator.validate.mockReturnValue({ valid: true });
    });

    it("should pass converted json to the schema validator", async () => {
      const converted = await convert.convert(result.data.questionnaire);
      expect(mockSchemaValidator.validate).toHaveBeenCalledWith(converted);
    });

    it("should error if resulting json is invalid", () => {
      mockSchemaValidator.validate.mockReturnValue({ valid: false });
      return expect(convert.convert(result.data.questionnaire)).rejects.toEqual(
        expect.any(ValidationError)
      );
    });
  });
});
