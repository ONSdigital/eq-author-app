const {
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
} = require("../../../constants/validationErrorCodes");
const createValidationError = require("../createValidationError");

const {
  getAbsolutePositionById,
  idExists,
} = require("../../../schema/resolvers/utils");

const pipedVariableIdRegex = /data-piped="variable" data-id="(.+?)"/gm;

const trimDateRangeId = (id) => id.replace(/(from|to)$/, "");

module.exports = (ajv) =>
  ajv.addKeyword({
    $data: true,
    keyword: "validatePipingVariableInTitle",
    validate: function isValid(
      _schema,
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
      const pipedIdList = [];

      let matches;

      do {
        matches = pipedVariableIdRegex.exec(title);

        if (matches && matches.length > 1) {
          const [, variableId] = matches;
          pipedIdList.push(trimDateRangeId(variableId));
        }
      } while (matches);

      if (!pipedIdList.length) {
        return true;
      }

      const hasError = (errorMessage) => {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            errorMessage,
            questionnaire,
            "deleted variable in title"
          ),
        ];

        return false;
      };

      for (const pipedId of pipedIdList) {
        if (!idExists({ questionnaire }, pipedId)) {
          return hasError(PIPING_TITLE_DELETED);
        }

        if (
          getAbsolutePositionById({ questionnaire }, pipedId) >
          getAbsolutePositionById({ questionnaire }, pageId)
        ) {
          return hasError(PIPING_TITLE_MOVED);
        }
      }

      return true;
    },
  });
