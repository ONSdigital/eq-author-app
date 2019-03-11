const Ajv = require("ajv");
const schemas = require("./schemas");
const customKeywords = require("./customKeywords");

const ajv = customKeywords(new Ajv({ allErrors: true }));

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

if (validate.errors) {
  throw new Error(validate.errors[0]);
}

module.exports = questionnaire => {
  validate(questionnaire);
  if (validate.errors) {
    console.log("errors", JSON.stringify(validate.errors));
  }
  return {};
};
