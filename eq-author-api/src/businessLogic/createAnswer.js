const { merge, includes, flatten, values } = require("lodash/fp");
const uuid = require("uuid");
const getDefaultAnswerProperties = require("../../utils/defaultAnswerProperties");
const { answerTypeMap } = require("../../utils/defaultAnswerValidations");
const {
  createDefaultValidationsForAnswer
} = require("../../repositories/strategies/validationStrategy");

module.exports = answer => {
  const defaultProperties = getDefaultAnswerProperties(answer.type);
  merge(answer, {
    properties: defaultProperties
  });

  const validation = {};
  if ((includes(answer.type), flatten(values(answerTypeMap)))) {
    const validations = createDefaultValidationsForAnswer(answer);
    validations.map(v => {
      validation[v.validationType] = {
        id: uuid.v4(),
        config: v.config,
        enabled: false
      };
    });
  }

  // if (answer.type === "Checkbox" || answer.type === "Radio") {
  //   const defaultOptions = [];
  //   const defaultOption = {
  //     label: "",
  //     description: "",
  //     value: "",
  //     qCode: "",
  //     answerId: answer.id
  //   };
  //
  //   defaultOptions.push(defaultOption);
  //
  //   if (answer.type === "Radio") {
  //     defaultOptions.push(defaultOption);
  //   }
  //
  //   const promises = defaultOptions.map(it =>
  //     OptionRepository(trx).insert(it)
  //   );
  //
  // }

  return {
    id: uuid.v4(),
    ...merge(answer, { properties: defaultProperties, validation })
  };
};
