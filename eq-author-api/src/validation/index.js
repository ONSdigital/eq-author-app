const Ajv = require("ajv");
const { get, uniqBy } = require("lodash");

const schemas = require("./schemas");
const { ANSWERS } = require("../../constants/validationErrorTypes");

const ajv = new Ajv({ allErrors: true, jsonPointers: true, $data: true });
require("ajv-errors")(ajv);
require("./customKeywords")(ajv);

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

const convertObjectType = objectType => {
  if (objectType === "additionalAnswer") {
    return ANSWERS;
  }

  return objectType;
};

module.exports = questionnaire => {
  validate(questionnaire);

  if (!validate.errors) {
    return {
      answers: {},
      pages: {},
      options: {},
      sections: {},
      totalCount: 0,
    };
  }
  const errorMessages = validate.errors.filter(
    err => err.keyword === "errorMessage"
  );

  const transformedMessages = uniqBy(errorMessages, "dataPath")
    .map(error => {
      const dataPath = error.dataPath.split("/");

      const fieldname = dataPath.pop();

      let objectType = dataPath[dataPath.length - 1];
      if (!isNaN(objectType)) {
        // Must be in array of object type so get object type
        // e.g. /sections/0/pages/0/answers/0/options/0/label
        objectType = dataPath[dataPath.length - 2];
      }

      const contextPath = dataPath.slice(1).join(".");

      const contextObj = get(questionnaire, contextPath);
      return {
        id: `${objectType}-${contextObj.id}-${fieldname}`,
        entityId: contextObj.id,
        type: convertObjectType(objectType),
        field: fieldname,
        errorCode: error.message,
        dataPath: dataPath.slice(1),
      };
    })
    .reduce(
      (structure, error) => {
        const { id, entityId, type, dataPath } = error;
        const errorInfo = structure[type][entityId] || {
          id,
          totalCount: 0,
          errors: [],
        };
        structure[type][entityId] = {
          ...errorInfo,
          totalCount: errorInfo.totalCount + 1,
          errors: [...errorInfo.errors, error],
        };

        const isChildOfPage =
          dataPath[0] === "sections" &&
          dataPath[2] === "pages" &&
          dataPath.length > 5;

        if (isChildOfPage) {
          const sectionIndex = parseInt(dataPath[1], 10);
          const pageIndex = parseInt(dataPath[3], 10);

          const page = questionnaire.sections[sectionIndex].pages[pageIndex];
          const errorInfo = structure.pages[page.id] || {
            totalCount: 0,
            errors: [],
          };
          structure.pages[page.id] = {
            ...errorInfo,
            totalCount: errorInfo.totalCount + 1,
          };
        }

        return structure;
      },
      {
        answers: {},
        pages: {},
        options: {},
        sections: {},
        totalCount: errorMessages.length,
      }
    );
  return transformedMessages;
};
