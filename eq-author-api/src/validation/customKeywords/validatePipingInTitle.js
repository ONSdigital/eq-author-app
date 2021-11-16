const {
  PIPING_METADATA_DELETED,
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
} = require("../../../constants/validationErrorCodes");

const { some } = require("lodash");
const createValidationError = require("../createValidationError");

const pipedMetadataIdRegex = /data-piped="metadata" data-id="(.+?)"/gm;
const pipedAnswerIdRegex = /data-piped="answers" data-id="(.+?)"/gm;
const {
  getAbsolutePositionById,
  idExists,
} = require("../../../schema/resolvers/utils");
const trimDateRangeId = (id) => id.replace(/(from|to)$/, "");

const metadataIdExists = (questionnaire, id) =>
  some(questionnaire.metadata, (metadata) => metadata.id === id);

module.exports = (ajv) =>
  ajv.addKeyword({
    $data: true,
    allErrors: true,
    keyword: "validatePipingInTitle",
    validate: function isValid(
      _schema,
      // textString,
      title,
      _parentSchema,
      {
        parentData: { id: pageId },
        parentDataProperty: fieldName,
        instancePath,
        rootData: questionnaire,
      }
    ) {
      isValid.errors = [];
      const pipedIdListMetadata = [];
      const pipedIdListAnswers = [];

      let matches, matches2;

      do {
        matches = pipedMetadataIdRegex.exec(title);

        if (matches && matches.length > 1) {
          const [, answerId] = matches;
          pipedIdListMetadata.push(trimDateRangeId(answerId));
        }
      } while (matches);

      do {
        matches2 = pipedAnswerIdRegex.exec(title);

        if (matches2 && matches2.length > 1) {
          const [, answerId] = matches2;
          pipedIdListAnswers.push(trimDateRangeId(answerId));
        }
      } while (matches2);

      if (!pipedIdListMetadata.length && !pipedIdListAnswers.length) {
        return true;
      }

      // write metadata deleted errors
      pipedIdListMetadata.forEach((id) => {
        if (!metadataIdExists(questionnaire, id)) {
          isValid.errors.push(
            createValidationError(
              instancePath,
              fieldName,
              PIPING_METADATA_DELETED,
              questionnaire
            )
          );
        }
      });

      // write deleted Answer or answer moved, errors
      for (const pipedId of pipedIdListAnswers) {
        if (!idExists({ questionnaire }, pipedId)) {
          isValid.errors.push(
            createValidationError(
              instancePath,
              fieldName,
              PIPING_TITLE_DELETED,
              questionnaire
            )
          );
        }

        if (
          getAbsolutePositionById({ questionnaire }, pipedId) >
          getAbsolutePositionById({ questionnaire }, pageId)
        ) {
          isValid.errors.push(
            createValidationError(
              instancePath,
              fieldName,
              PIPING_TITLE_MOVED,
              questionnaire
            )
          );
        }
      }

      if (isValid.errors.length) {
        return false;
      }

      return true;
    },
  });
