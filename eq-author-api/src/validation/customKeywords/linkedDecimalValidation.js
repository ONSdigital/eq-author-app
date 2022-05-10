//This helprr is currently UNUSED, but kept for future use

const { get, isNumber } = require("lodash");

const {
  ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY,
} = require("../../../constants/validationErrorCodes");

const { getAnswerById } = require("../../../schema/resolvers/utils");
const createValidationError = require("../createValidationError");
const { getPath } = require("../utils");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "linkedDecimalValidation",
    $data: true,
    validate: function isValid(
      schema,
      _data,
      _parentSchema,
      {
        rootData: questionnaire,
        parentData,
        parentDataProperty: fieldName,
        instancePath,
      }
    ) {
      isValid.errors = [];

      const { sections, folders, pages, answers, lists } =
        getPath(instancePath);
      let currentAnswerValidation;
      if (folders) {
        currentAnswerValidation =
          schema[sections].folders[folders].pages[pages].answers[answers]
            .validation;
      }
      if (lists) {
        currentAnswerValidation =
          questionnaire.collectionLists.lists[lists].answers[answers]
            .validation;
      }

      const minValidation = currentAnswerValidation.minValue;
      const maxValidation = currentAnswerValidation.maxValue;
      [minValidation, maxValidation].forEach((validation) => {
        if (
          validation?.enabled &&
          validation?.entityType === "PreviousAnswer"
        ) {
          const referencedAnswer = getAnswerById(
            { questionnaire },
            validation.previousAnswer
          );
          const referencedDecimals = get(
            referencedAnswer,
            "properties.decimals"
          );

          if (
            isNumber(referencedDecimals) &&
            isNumber(parentData.decimals) &&
            parentData.decimals !== referencedDecimals
          ) {
            const err = createValidationError(
              instancePath,
              fieldName,
              ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY,
              questionnaire
            );
            isValid.errors.push(err);
          }
        }
      });

      return false;
    },
  });
