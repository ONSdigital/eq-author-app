const Questionnaire = require("../eq_schema/Questionnaire");
const ValidationError = require("../validation/ValidationError");

class Convert {
  constructor(schemaValidator) {
    if (!schemaValidator) {
      throw Error("no schema validator provided");
    }
    this.schemaValidator = schemaValidator;
  }

  async convert(authorJson) {
    const convertedQuestionnaire = new Questionnaire(authorJson);

    const result = await this.schemaValidator.validate(convertedQuestionnaire);

    if (!result.valid) {
      throw new ValidationError(
        "Converted author schema is not valid EQ schema.",
        convertedQuestionnaire,
        result.errors
      );
    }

    return convertedQuestionnaire;
  }
}

module.exports = Convert;
