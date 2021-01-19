const { includes, flatten, values, omit, find, get } = require("lodash/fp");
const { v4: uuidv4 } = require("uuid");
const getDefaultAnswerProperties = require("../../utils/defaultAnswerProperties");
const { answerTypeMap } = require("../../utils/defaultAnswerValidations");
const {
  createDefaultValidationsForAnswer,
} = require("../../src/businessLogic/createValidation");
const { merge } = require("lodash");

module.exports = (answer, page) => {
  let properties = getDefaultAnswerProperties(answer.type);

  if (get("answers", page)) {
    const existingAnswerTypes = page.answers.map(a => a.type);

    if (existingAnswerTypes.includes(answer.type)) {
      const sharedProperties = find({ type: answer.type }, page.answers)
        .properties;
      properties = sharedProperties;
    }
  }

  const validation = {};
  if (includes(answer.type, flatten(values(answerTypeMap)))) {
    const validations = createDefaultValidationsForAnswer(answer);
    validations.map(v => {
      validation[v.validationType] = {
        id: uuidv4(),
        enabled: false,
        ...omit("config", v),
        ...v.config,
      };
    });
  }

  let defaultOptions;
  if (answer.type === "Checkbox" || answer.type === "Radio") {
    const createOption = require("./createOption");

    defaultOptions = [];
    defaultOptions.push(createOption());

    if (answer.type === "Radio") {
      defaultOptions.push(createOption());
    }
  }

  return {
    id: uuidv4(),
    ...merge(answer, {
      properties,
      validation,
      options: defaultOptions,
    }),
  };
};
