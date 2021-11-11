const {
  PIPING_METADATA_DELETED,
} = require("../../../constants/validationErrorCodes");

const { some } = require("lodash");
const createValidationError = require("../createValidationError");

const pipedAnswerIdRegex = /data-piped="metadata" data-id="(.+?)"/gm;

const trimDateRangeId = (id) => id.replace(/(from|to)$/, "");

const metadataIdExists = (questionnaire, id) =>
  some(questionnaire.metadata, (metadata) => metadata.id === id);

module.exports = (ajv) =>
  ajv.addKeyword({
    $data: true,
    // allErrors: true,
    keyword: "validatePipingMetadataInTitle",
    validate: function isValid(
      _schema,
      textString,
      _parentSchema,
      { parentDataProperty: fieldName, instancePath, rootData: questionnaire }
    ) {
      console.log(`textString`, textString);
      isValid.errors = [];
      const pipedIdList = [];

      let matches;

      do {
        matches = pipedAnswerIdRegex.exec(textString);

        if (matches && matches.length > 1) {
          const [, answerId] = matches;
          pipedIdList.push(trimDateRangeId(answerId));
        }
      } while (matches);

      if (!pipedIdList.length) {
        return true;
      }

      pipedIdList.forEach((id) => {
        if (!metadataIdExists(questionnaire, id)) {
          isValid.errors = [
            createValidationError(
              instancePath,
              fieldName,
              PIPING_METADATA_DELETED,
              questionnaire
            ),
          ];
        }
      });

      if (isValid.errors.length) {
        return false;
      }

      return true;
    },
  });
