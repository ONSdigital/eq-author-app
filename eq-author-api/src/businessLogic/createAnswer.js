const { merge, includes, flatten, values } = require("lodash/fp");
const uuid = require("uuid");
const getDefaultAnswerProperties = require("../../utils/defaultAnswerProperties");
const { answerTypeMap } = require("../../utils/defaultAnswerValidations");
const {
  createDefaultValidationsForAnswer
} = require("../../repositories/strategies/validationStrategy");

const createOption = require("./createOption");

module.exports = answer => {
  const defaultProperties = getDefaultAnswerProperties(answer.type);
  merge(answer, {
    properties: defaultProperties
  });

  const validation = {};
  if (includes(answer.type, flatten(values(answerTypeMap)))) {
    const validations = createDefaultValidationsForAnswer(answer);
    validations.map(v => {
      validation[v.validationType] = {
        id: uuid.v4(),
        config: v.config,
        enabled: false
      };
    });
  }

  const defaultOptions = [];
  if (answer.type === "Checkbox" || answer.type === "Radio") {
    defaultOptions.push(createOption());

    if (answer.type === "Radio") {
      defaultOptions.push(createOption());
    }
  }

  return {
    id: uuid.v4(),
    ...merge(answer, {
      properties: defaultProperties,
      validation,
      options: defaultOptions
    })
  };
};
