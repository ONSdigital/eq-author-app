const ValidationError = require("./ValidationError");
const { isNil } = require("lodash");

class SchemaValidator {
  constructor(validationApi) {
    this.validationApi = validationApi;
  }

  async validate(json) {
    if (isNil(json)) {
      throw new ValidationError("Invalid JSON schema");
    }
    return this.validationApi.validate(json);
  }
}

module.exports = SchemaValidator;
