const {
  answerTypeMap,
  validationRuleMap,
  defaultValidationRuleConfigs,
  defaultValidationEntityTypes,
} = require("../../utils/defaultAnswerValidations");

const { findKey, includes } = require("lodash");

const getValidationEntity = (type) =>
  findKey(answerTypeMap, (field) => includes(field, type));

const createDefaultValidationsForAnswer = ({ type }) => {
  const validationEntity = getValidationEntity(type);

  const validationTypes = validationRuleMap[validationEntity];

  return validationTypes.map((validationType) => ({
    validationType,
    config: defaultValidationRuleConfigs[validationType],
    entityType: defaultValidationEntityTypes({ type })[validationType]
      .entityType,
  }));
};

Object.assign(module.exports, {
  createDefaultValidationsForAnswer,
  getValidationEntity,
});
